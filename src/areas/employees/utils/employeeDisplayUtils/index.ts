import type { Department } from '../../types';

// Fallback palette used only when a department has no color set.
export const DEPARTMENT_BADGE_FALLBACK_COLORS = [
	{ backgroundColor: '#fce7f3', color: '#9d174d' }, // pink
	{ backgroundColor: '#fef9c3', color: '#854d0e' }, // yellow
	{ backgroundColor: '#dcfce7', color: '#14532d' }, // green
	{ backgroundColor: '#e0f2fe', color: '#0c4a6e' }, // sky
	{ backgroundColor: '#fff7ed', color: '#7c2d12' }, // orange
	{ backgroundColor: '#f3e8ff', color: '#581c87' }, // purple
] as const;

export function getInitials(name: string): string {
	return name
		.split(' ')
		.slice(0, 2)
		.map((part) => part[0] ?? '')
		.join('')
		.toUpperCase();
}

export function getDepartmentBadgeStyle(department: Department): {
	backgroundColor: string,
	color: string,
} {
	if (department.color) {
		return {
			backgroundColor: `${department.color}33`,
			color: department.color,
		};
	}
	return DEPARTMENT_BADGE_FALLBACK_COLORS[department.id % DEPARTMENT_BADGE_FALLBACK_COLORS.length];
}
