import { HttpHandler, PathParams } from 'msw';

/** Generic type providing keyed url string entries based off given parameters type. For use in mock api responses */
export type UrlParams<TParams> = {
	[key in keyof TParams]: string
};

/** Attempts to resolve an integer numeric value for the route path parameter with the given name. For use in mock api responses */
export function getIntRequestParam(name: string, params: PathParams) {
	const paramVal = params[name];
	if (!paramVal) {
		throw Error(`No value for expected request url param ${name}`);
	}
	if (typeof paramVal == 'string') {
		const intVal = parseInt(paramVal);
		if (isNaN(intVal)) {
			throw Error(`Param '${name}' value ${paramVal} could not be parsed as integer`);
		}
		return intVal;
	}
	else {
		throw Error(`Param '${name}' returned multiple values`);
	}
}

/** Applies a basic case-insensitive includes filter on an object set against one more props. For use in mock api responses */
export function getMockFilteredResults<TData extends object>(baseSet: TData[], filter: string | null | undefined, propNames: (keyof TData)[]) {
	if (!filter) {
		return baseSet;
	}

	const lcFilter = filter.toLowerCase();

	const compareFunc = (item: TData) => {
		return propNames.some(name => {
			const propVal = item[name];
			const propValString = typeof propVal == 'string' ? propVal : '';
			if (propValString.toLowerCase().includes(lcFilter)) {
				return true;
			}
			return false;
		});
	};

	return baseSet.filter(compareFunc);
}

/** Outputs details of the route paths and methods for the given handlers to the console */
export function outputHandlersToConsole(handlers: HttpHandler[]) {
	console.groupCollapsed(`MSW: ${handlers.length} mock handlers registered`);
	handlers.forEach((handler) => {
		console.log(`${handler.info.method} ${handler.info.path}`);
	});
	console.groupEnd();
}