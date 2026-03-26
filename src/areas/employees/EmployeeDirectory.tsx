import { useQuery } from '@tanstack/react-query';

import { executeGetEmployees } from './service/employeeService';

export const EmployeeDirectory = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['employees'],
		queryFn: ()=>executeGetEmployees({}),
	});


	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading employees.</p>}
			{data && (
				<ul>
					{data.employees.map(employee => (
						<li key={employee.id}>{employee.name}</li>
					))}
				</ul>
			)}
		</>
	);
};