import { DTO_Employee } from './employeeService';

const idCounter = 0;

function createData(name: string, departmentId: number, departmentName: string, locationId: number, locationName: string, roleId: number, roleName: string): DTO_Employee {
	return {
		id: idCounter,
		name,
		department: {
			id: departmentId,
			name: departmentName,
		},
		location: {
			id: locationId,
			name: locationName,
		},
		role: {
			id: roleId,
			name: roleName,
		},
	};
}

const generateDataSet = (count:number)=>{
	const dataSet: DTO_Employee[] = [];
	for(let i = 1; i <= count; i++) {
		dataSet.push(createData(`Employee ${i}`, i % 3, `Department ${i % 3}`, i % 2, `Location ${i % 2}`, i % 4, `Role ${i % 4}`));
	}
	return dataSet;
};

export const mockData = generateDataSet(15);