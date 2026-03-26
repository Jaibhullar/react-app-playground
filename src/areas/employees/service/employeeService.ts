import { API_BASE_URL } from '@/common/constants';

import type { Employee } from '../types';

export type DTO_Employee = {
	id: number,
	name: string,
	department: {
		id: number,
		name: string,
	},
	location: {
		id: number,
		name: string,
	},
	role: {
		id: number,
		name: string,
	},
};

export type DTO_GetEmployeesResponse = {
	employees: DTO_Employee[],
};

export type GetEmployeesRequest = {
	departmentId?: number,
	locationId?: number,
	roleId?: number,
};

export type GetEmployeesResponse = {
	employees: Employee[],
};

const getEmployeesRoute = 'employees:department=:departmentId&location=:locationId&role=:roleId' as const;

function transformDTO(dto: DTO_Employee) {
	const { id, name, department, location, role } = dto;
	const employee : Employee = {
		id,
		name,
		department,
		location,
		role,
	};
	return employee;
}

export async function executeGetEmployees(request: GetEmployeesRequest) {
	const url = getQueryUrl(request);

	// Note there is no error handling and we are using base fetch here for demo simplicity.
	return fetch(url)
		.then(response=>
			response.json()
		)
		.then(json=>{
			const responseDTO = json as DTO_GetEmployeesResponse;
			const response : GetEmployeesResponse = { employees: responseDTO.employees.map(transformDTO) };
			return response;
		});
}


function getQueryUrl(request: GetEmployeesRequest) {
	const departmentId = request.departmentId ?? 'all';
	const locationId = request.locationId ?? 'all';
	const roleId = request.roleId ?? 'all';
	return `${API_BASE_URL}${getEmployeesRoute.replace(':departmentId', String(departmentId)).replace(':locationId', String(locationId)).replace(':roleId', String(roleId))}`;
}

export const employeeServiceMeta = { routes: { getItems: getEmployeesRoute } };