import React from 'react';
import { UnitPlan } from '../data';

interface PlanSelectorProps {
    plans: UnitPlan[];
    selectedPlanId: string | null;
    onSelectPlan: (id: string) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({ plans, selectedPlanId, onSelectPlan }) => {
    return (
        <div className="relative">
            <select
                value={selectedPlanId || ''}
                onChange={(e) => onSelectPlan(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Select a unit plan"
            >
                {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                        {plan.fileName}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};