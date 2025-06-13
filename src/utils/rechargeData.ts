
export interface RechargePlan {
  id: string;
  amount: number;
  validity: string;
  description: string;
  benefits: string[];
  popular?: boolean;
  type: 'topup' | 'fulltt' | 'data' | 'roaming';
}

export const getPlansForOperator = (operator: string): RechargePlan[] => {
  const commonPlans: Record<string, RechargePlan[]> = {
    'Jio': [
      {
        id: 'jio_149',
        amount: 149,
        validity: '30 days',
        description: 'Unlimited calls + 2GB/day data',
        benefits: ['Unlimited calls', '2GB/day data', '100 SMS/day', 'JioApps'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'jio_239',
        amount: 239,
        validity: '28 days',
        description: 'Unlimited calls + 1.5GB/day data',
        benefits: ['Unlimited calls', '1.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_399',
        amount: 399,
        validity: '84 days',
        description: 'Unlimited calls + 2.5GB/day data',
        benefits: ['Unlimited calls', '2.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_10',
        amount: 10,
        validity: '1 day',
        description: 'Special tariff - ₹0.1/min',
        benefits: ['₹0.1/min calls', 'No data'],
        type: 'topup'
      },
      {
        id: 'jio_101',
        amount: 101,
        validity: '14 days',
        description: '6GB data only',
        benefits: ['6GB total data', 'No calls/SMS'],
        type: 'data'
      }
    ],
    'Airtel': [
      {
        id: 'airtel_155',
        amount: 155,
        validity: '30 days',
        description: 'Unlimited calls + 1GB/day data',
        benefits: ['Unlimited calls', '1GB/day data', '100 SMS/day', 'Airtel Thanks'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'airtel_265',
        amount: 265,
        validity: '30 days',
        description: 'Unlimited calls + 1.5GB/day data',
        benefits: ['Unlimited calls', '1.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_449',
        amount: 449,
        validity: '84 days',
        description: 'Unlimited calls + 2GB/day data',
        benefits: ['Unlimited calls', '2GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_23',
        amount: 23,
        validity: '1 day',
        description: 'Special tariff - ₹0.3/min',
        benefits: ['₹0.3/min calls', 'No data'],
        type: 'topup'
      },
      {
        id: 'airtel_98',
        amount: 98,
        validity: '12 days',
        description: '12GB data only',
        benefits: ['12GB total data', 'No calls/SMS'],
        type: 'data'
      }
    ],
    'Vi': [
      {
        id: 'vi_179',
        amount: 179,
        validity: '28 days',
        description: 'Unlimited calls + 1.5GB/day data',
        benefits: ['Unlimited calls', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'vi_299',
        amount: 299,
        validity: '28 days',
        description: 'Unlimited calls + 2GB/day data',
        benefits: ['Unlimited calls', '2GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_479',
        amount: 479,
        validity: '84 days',
        description: 'Unlimited calls + 1.5GB/day data',
        benefits: ['Unlimited calls', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_20',
        amount: 20,
        validity: '1 day',
        description: 'Special tariff - ₹0.25/min',
        benefits: ['₹0.25/min calls', 'No data'],
        type: 'topup'
      },
      {
        id: 'vi_118',
        amount: 118,
        validity: '18 days',
        description: '15GB data only',
        benefits: ['15GB total data', 'No calls/SMS'],
        type: 'data'
      }
    ],
    'BSNL': [
      {
        id: 'bsnl_187',
        amount: 187,
        validity: '28 days',
        description: 'Unlimited calls + 2GB/day data',
        benefits: ['Unlimited calls', '2GB/day data', '100 SMS/day', 'Free roaming'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'bsnl_247',
        amount: 247,
        validity: '45 days',
        description: 'Unlimited calls + 1GB/day data',
        benefits: ['Unlimited calls', '1GB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      {
        id: 'bsnl_397',
        amount: 397,
        validity: '80 days',
        description: 'Unlimited calls + 1GB/day data',
        benefits: ['Unlimited calls', '1GB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      {
        id: 'bsnl_22',
        amount: 22,
        validity: '1 day',
        description: 'Special tariff - ₹0.4/min',
        benefits: ['₹0.4/min calls', 'No data'],
        type: 'topup'
      },
      {
        id: 'bsnl_78',
        amount: 78,
        validity: '10 days',
        description: '5GB data only',
        benefits: ['5GB total data', 'No calls/SMS'],
        type: 'data'
      }
    ]
  };

  return commonPlans[operator] || [];
};
