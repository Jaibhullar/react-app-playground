import type { Department } from '../../types';

/** Hex alpha suffix that gives a badge background 20% opacity (0x33 / 255 ≈ 0.20). */
const BADGE_BACKGROUND_ALPHA_HEX = '33' as const;

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
	return {
		backgroundColor: `${department.color}${BADGE_BACKGROUND_ALPHA_HEX}`,
		color: department.color,
	};
}
