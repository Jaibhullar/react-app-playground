import { bypass, DefaultBodyType, delay, http, HttpRequestResolverExtras, HttpResponse, HttpResponseInit, JsonBodyType, PathParams, ResponseResolverInfo } from 'msw';

/** Type describing response content for a mocked status code request */
export type StatusResponseOptions = {
	/** Status plain text content */
	statusText?: string,
	/** Delay in seconds to apply to the response */
	delay?: number,
	/** Status JSON content function */
	jsonBody?: () => JsonBodyType,
	/** Status plain text content resolution function */
	textBody?: () => string,
};

export type MockFactoryOptions = {
	/** Delay in seconds to apply to all responses */
	delaySeconds?: number,
};

async function resolveOriginalJson<
	TData extends JsonBodyType | void,
	TParams extends PathParams
>(
	resolver: ResponseResolverInfo<
		HttpRequestResolverExtras<TParams>,
		DefaultBodyType
	>
) {
	const bypassReq = bypass(resolver.request);

	return fetch(bypassReq).then((res) => res.json() as Promise<TData>);
}

async function resolveOriginalText<TData extends string>(
	resolver: ResponseResolverInfo<
		HttpRequestResolverExtras<PathParams>,
		DefaultBodyType
	>
) {
	const bypassReq = bypass(resolver.request);

	return fetch(bypassReq).then((res) => res.text() as Promise<TData>);
}

export type RequestHandlerInput<
	TData extends JsonBodyType | void = void,
	TParams extends PathParams = PathParams
> = {
	/** Route url parameters object
	 * @example { employeeId: '123' } for route /api/employee/:employeeId
	 */
	routeParams: TParams,
	/** Request query string parameters object */
	queryParams: URLSearchParams,
	/** Function to resolve the request from the original API endpoint */
	resolveOriginalRequest: () => Promise<TData>,
	/** Underlying msw resolver object, for advanced use cases */
	mswResolver: ResponseResolverInfo<
		HttpRequestResolverExtras<TParams>,
		DefaultBodyType
	>,
};

export type ContentRequestHandlerInput<
	TData extends JsonBodyType,
	TReturn extends JsonBodyType | void = void,
	TParams extends PathParams = PathParams
> = {
	/** Content request data */
	content: TData,
	/** Route url parameters object
	 * @example { employeeId: '123' } for route /api/employee/:employeeId
	 */
	routeParams: TParams,
	/** Function to resolve the request from the original API endpoint */
	resolveOriginalRequest: () => Promise<TReturn>,
	/** Underlying msw resolver object, for advanced use cases */
	mswResolver: ResponseResolverInfo<
		HttpRequestResolverExtras<TParams>,
		JsonBodyType
	>,
};

/** SHOULD NOT BE USED DIRECTLY, but as a base for creating application specific factory object.
 *
 * Creates a mock response factory helper object based around the given route, with specified api and global delay functions. */
export function base_createMockResponseFactory(route: string, mockApiUrl: (route: string) => string, globalMockDelay?: () => Promise<void>, options?: MockFactoryOptions) {


	async function handleDelay(customDelay?: number) {
		if (globalMockDelay) {
			await globalMockDelay();
		}
		if(options?.delaySeconds) {
			await delay(options.delaySeconds * 1000);
		}
		if (customDelay) {
			await delay(customDelay * 1000);
		}
	}

	// #region GET

	function getJson<
		TData extends JsonBodyType,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		get: (
			handlerInput: RequestHandlerInput<TData, TParams>
		) => TData | Response | Promise<TData | Response>
	) {
		return http.get<TParams, DefaultBodyType>(mockApiUrl(route), async (resolver) => {
			await handleDelay();

			const original = <TData extends JsonBodyType>() =>
				resolveOriginalJson<TData, TParams>(resolver);

			const response = get({
				routeParams: resolver.params,
				queryParams: new URL(resolver.request.url).searchParams,
				resolveOriginalRequest: original,
				mswResolver: resolver,
			});
			const result = await Promise.resolve(response);
			return result instanceof Response
				? result
				: HttpResponse.json(result);
		});
	}

	function getText<
		TData extends string = string,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		get: (
			handlerInput: RequestHandlerInput<TData, TParams>
		) => string | Response | Promise<string | Response>
	) {
		return http.get<TParams, DefaultBodyType>(mockApiUrl(route), async (resolver) => {
			await handleDelay();

			const response = get({
				routeParams: resolver.params,
				queryParams: new URL(resolver.request.url).searchParams,
				resolveOriginalRequest: () =>
					resolveOriginalText<TData>(resolver),
				mswResolver: resolver,
			});
			const result = await Promise.resolve(response);
			return result instanceof Response
				? result
				: HttpResponse.text(result);
		});
	}

	// #endregion

	// #region POST

	function postJson<
		TData extends JsonBodyType,
		TReturn extends JsonBodyType | void = void,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		post: (
			handlerInput: ContentRequestHandlerInput<TData, TReturn, TParams>
		) => TReturn | Response | Promise<TReturn | Response>
	) {
		return http.post<TParams, JsonBodyType>(mockApiUrl(route), async (resolver) => {
			await handleDelay();

			// Clone request to prevent body reuse issue if resolveOriginal used
			const input = (await resolver.request.clone().json()) as TData;

			const response = post({
				content: input,
				routeParams: resolver.params,
				resolveOriginalRequest: () =>
					resolveOriginalJson<TReturn, TParams>(resolver),
				mswResolver: resolver,
			});
			const result = await Promise.resolve(response);
			if (result instanceof Response) {
				return result;
			}
			return result
				? HttpResponse.json(result)
				: new HttpResponse(null, { status: 200 });
		});
	}

	function postForm<
		TReturn extends JsonBodyType | void = void,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		post: (
			handlerInput: ContentRequestHandlerInput<FormData, TReturn, TParams>
		) => TReturn | Response | Promise<TReturn | Response>
	) {
		return http.post<TParams, DefaultBodyType>(mockApiUrl(route), async (resolver) => {
			await handleDelay();

			const input = await resolver.request.clone().formData();
			const response = post({
				content: input,
				routeParams: resolver.params,
				resolveOriginalRequest: () =>
					resolveOriginalJson<TReturn, TParams>(resolver),
				mswResolver: resolver,
			});
			const result = await Promise.resolve(response);
			if (result instanceof Response) {
				return result;
			}
			return result
				? HttpResponse.json(result)
				: new HttpResponse(null, { status: 200 });
		});
	}

	function postEmpty<
		TReturn extends JsonBodyType | void = void,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		post: (
			handlerInput: RequestHandlerInput<TReturn, TParams>
		) => TReturn | Response | Promise<TReturn | Response>
	) {
		return http.post<TParams, DefaultBodyType>(mockApiUrl(route), async (resolver) => {
			await handleDelay();

			const response = post({
				queryParams: new URL(resolver.request.url).searchParams,
				routeParams: resolver.params,
				resolveOriginalRequest: () =>
					resolveOriginalJson<TReturn, TParams>(resolver),
				mswResolver: resolver,
			});
			const result = await Promise.resolve(response);
			if (result instanceof Response) {
				return result;
			}
			return result
				? HttpResponse.json(result)
				: new HttpResponse(null, { status: 200 });
		});
	}

	// #endregion

	// #region PUT

	function putJson<
		TData extends JsonBodyType,
		TReturn extends JsonBodyType | void = void,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		put: (
			handlerInput: ContentRequestHandlerInput<TData, TReturn, TParams>
		) => TReturn | Response | Promise<TReturn | Response>
	) {
		return http.put<TParams, JsonBodyType>(mockApiUrl(route), async (rq) => {
			await handleDelay();

			const input = (await rq.request.clone().json()) as TData;
			const response = put({
				content: input,
				routeParams: rq.params,
				resolveOriginalRequest: () =>
					resolveOriginalJson<TReturn, TParams>(rq),
				mswResolver: rq,
			});
			const result = await Promise.resolve(response);
			if (result instanceof Response) {
				return result;
			}
			return result
				? HttpResponse.json(result)
				: new HttpResponse(null, { status: 200 });
		});
	}

	function putEmpty<
		TReturn extends JsonBodyType | void = void,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		put: (
			handlerInput: RequestHandlerInput<TReturn, TParams>
		) => TReturn | Response | Promise<TReturn | Response>
	) {
		return http.put<TParams, DefaultBodyType>(mockApiUrl(route), async (resolver) => {
			await handleDelay();

			const response = put({
				queryParams: new URL(resolver.request.url).searchParams,
				routeParams: resolver.params,
				resolveOriginalRequest: () =>
					resolveOriginalJson<TReturn, TParams>(resolver),
				mswResolver: resolver,
			});
			const result = await Promise.resolve(response);
			if (result instanceof Response) {
				return result;
			}
			return result
				? HttpResponse.json(result)
				: new HttpResponse(null, { status: 200 });
		});
	}

	// #endregion

	// #region Status Responses

	// Build response handler for specific status code, with optional content
	function getStatusHandler(status: number, options?: StatusResponseOptions) {
		return async () => {
			await handleDelay(options?.delay);

			const responseInit: HttpResponseInit = {
				status,
				statusText: options?.statusText,
			};


			return options?.jsonBody
				? HttpResponse.json(options.jsonBody(), responseInit)
				: options?.textBody
					? HttpResponse.text(options.textBody(), responseInit)
					: new HttpResponse(null, responseInit);
		};
	}

	function getStatus(statusCode: number, options?: StatusResponseOptions) {
		return http.get(mockApiUrl(route), getStatusHandler(statusCode, options));
	}

	function postStatus(statusCode: number, options?: StatusResponseOptions) {
		return http.post(mockApiUrl(route), getStatusHandler(statusCode, options));
	}

	function putStatus(statusCode: number, options?: StatusResponseOptions) {
		return http.put(mockApiUrl(route), getStatusHandler(statusCode, options));
	}

	// Build functions for GET standard response codes
	function getStandardResponses() {
		return {
			status200: getStatus(200, { statusText: 'Ok (mk)' }),
			status204: getStatus(204, { statusText: 'No Content (mk)' }),
			status400: getStatus(400, { statusText: 'Bad Request (mk)' }),
			status401: getStatus(401, { statusText: 'Unauthenticated (mk)' }),
			status403: getStatus(403, { statusText: 'Forbidden (mk)' }),
			status500: getStatus(500, { statusText: 'Server Error (mk)' }),
		};
	}

	// Build functions for POST standard response codes
	function postStandardResponses() {
		return {
			status200: postStatus(200, { statusText: 'Ok (mk)' }),
			status201: postStatus(201, { statusText: 'Created (mk)' }),
			status202: postStatus(202, { statusText: 'Accepted (mk)' }),
			status204: postStatus(204, { statusText: 'No Content (mk)' }),
			status400: postStatus(400, { statusText: 'Bad Request (mk)' }),
			status401: postStatus(401, { statusText: 'Unauthenticated (mk)' }),
			status403: postStatus(403, { statusText: 'Forbidden (mk)' }),
			status409: postStatus(409, { statusText: 'Conflict (mk)' }),
			status500: postStatus(500, { statusText: 'Server Error (mk)' }),
		};
	}

	// Build functions for PUT standard response codes
	function putStandardResponses() {
		return {
			status200: putStatus(200, { statusText: 'Ok (mk)' }),
			status201: putStatus(201, { statusText: 'Created (mk)' }),
			status202: putStatus(202, { statusText: 'Accepted (mk)' }),
			status204: putStatus(204, { statusText: 'No Content (mk)' }),
			status400: putStatus(400, { statusText: 'Bad Request (mk)' }),
			status401: putStatus(401, { statusText: 'Unauthenticated (mk)' }),
			status403: putStatus(403, { statusText: 'Forbidden (mk)' }),
			status409: putStatus(409, { statusText: 'Conflict (mk)' }),
			status500: putStatus(500, { statusText: 'Server Error (mk)' }),
		};
	}

	// #endregion

	// #region DELETE

	function delWithParams<TParams extends PathParams>(
		/** Mock execution function */
		del: (
			/** Route url parameters object
			 * @example { employeeId: '123' } for route /api/employee/:employeeId
			 */
			params: TParams
		) => void,
		use204Response?: boolean
	) {
		return http.delete<TParams>(mockApiUrl(route), async (rq) => {
			if(globalMockDelay) {
				await globalMockDelay();
			}

			del(rq.params);

			return new HttpResponse(null, {
				status: use204Response ? 204 : 200,
			});
		});
	}

	function deleteStatus(statusCode: number, options?: StatusResponseOptions) {
		return http.delete(mockApiUrl(route), getStatusHandler(statusCode, options));
	}

	function deleteStandardResponses() {
		return {
			status200: deleteStatus(200, { statusText: 'Ok (mk)' }),
			status401: deleteStatus(401, {
				statusText: 'Unauthenticated (mk)',
			}),
			status403: deleteStatus(403, { statusText: 'Forbidden (mk)' }),
			status500: deleteStatus(500, { statusText: 'Server Error (mk)' }),
			status409: deleteStatus(409, { statusText: 'Conflict (mk)' }),
		};
	}

	function delJson<
		TData extends JsonBodyType,
		TReturn extends JsonBodyType | void = void,
		TParams extends PathParams = PathParams
	>(
		/** Mock execution function */
		process: (
			/** DELETE content data JSON object */
			content: TData,
			/** Route url parameters object
			 * @example { employeeId: '123' } for route /api/employee/:employeeId
			 */
			params: TParams
		) => TReturn
	) {
		return http.delete<TParams, JsonBodyType>(mockApiUrl(route), async (info) => {
			await handleDelay();

			const input =
				info.request.body != null
					? ((await info.request.json()) as TData)
					: (undefined as TData);
			const result = process(input, info.params);
			return result
				? HttpResponse.json(result)
				: new HttpResponse(null, { status: 200 });
		});
	}

	// #endregion

	return {
		/** GET Method mock creation helpers */
		get: {
			/** Creates a MSW handler to mock a GET request that returns JSON data */
			json: getJson,
			/** Creates a MSW handler to mock a GET request that returns plain text data */
			text: getText,
			/** Creates a MSW handler to mock a GET request that returns a specific status code */
			status: getStatus,
			/** Pre-built standard response code handlers for GET requests */
			statusResponses: getStandardResponses(),
		},
		/** POST Method mock creation helpers */
		post: {
			/** Creates an MSW handler to mock a POST request with JSON content data and optional JSON return */
			json: postJson,
			/** Creates an MSW handler to mock a POST request with form content data and optional JSON return */
			form: postForm,
			/** Creates an MSW handler to mock a POST request with no content and optional JSON return */
			empty: postEmpty,
			/** Creates an MSW handler to mock a POST request with no body, with optional JSON or text response content */
			status: postStatus,
			/** Pre-built standard response code handlers for POST requests */
			statusResponses: postStandardResponses(),
		},
		/** PUT Method mock creation helpers */
		put: {
			/** Creates an MSW handler to mock a PUT request with JSON content data and optional JSON return */
			json: putJson,
			/** Creates an MSW handler to mock a PUT request with no content and optional JSON return */
			empty: putEmpty,
			/** Creates an MSW handler to mock a PUT request with no body, with optional JSON or text response content */
			status: putStatus,
			/** Pre-built standard response code handlers for PUT requests */
			statusResponses: putStandardResponses(),
		},
		/** DELETE Method mock creation helpers */
		delete: {
			/** Creates an MSW handler to mock a DELETE request with no content or return data */
			paramsOnly: delWithParams,
			/** Creates an MSW handler to mock a DELETE request with JSON content data and optional JSON return */
			json: delJson,
			/** Pre-built standard response code handlers for DELETE requests */
			statusResponses: deleteStandardResponses(),
		},
	};
}
