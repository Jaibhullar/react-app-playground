import { useQuery } from '@tanstack/react-query';

import { executeGetEmployeeDetail, executeGetEmployees } from './service/employeeService';

export const EmployeeDirectory = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['employees'],
		queryFn: ()=>executeGetEmployees({}),
	});

	const { data: employeeDetailData } = useQuery({
		queryKey: ['employeeDetail', 30],
		queryFn: ()=>executeGetEmployeeDetail({ employeeId: 30 }),
		enabled: !!data, // Only run this query if the employee list has loaded
	});
	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error loading employees.</p>}
			{employeeDetailData?.employee && (
				<div>
					<h2>Employee Detail</h2>
					<p>Name: {employeeDetailData.employee.name}</p>
					<p>Email: {employeeDetailData.employee.email}</p>
					<p>Phone: {employeeDetailData.employee.phone}</p>
				</div>
			)}
			{data && (
				<ul>
					{data.employees.map(employee => (
						<li key={employee.id}>
							{employee.name} - {employee.department.name} - {employee.location.name} - {employee.role.name} - ID: {employee.id}
						</li>
					))}
				</ul>
			)}
		</>
	);
};