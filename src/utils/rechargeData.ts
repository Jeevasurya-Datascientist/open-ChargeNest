
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
      // Full Talktime Plans
      {
        id: 'jio_149',
        amount: 149,
        validity: '30 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'JioApps'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'jio_179',
        amount: 179,
        validity: '30 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_239',
        amount: 239,
        validity: '28 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_299',
        amount: 299,
        validity: '28 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_349',
        amount: 349,
        validity: '30 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_399',
        amount: 399,
        validity: '84 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'JioApps'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'jio_479',
        amount: 479,
        validity: '56 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_533',
        amount: 533,
        validity: '56 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_666',
        amount: 666,
        validity: '84 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_719',
        amount: 719,
        validity: '84 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_999',
        amount: 999,
        validity: '84 days',
        description: 'Unlimited Voice + 3GB/day data',
        benefits: ['Unlimited Voice', '3GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_1559',
        amount: 1559,
        validity: '336 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      {
        id: 'jio_2999',
        amount: 2999,
        validity: '365 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'JioApps'],
        type: 'fulltt'
      },
      // Data Plans
      {
        id: 'jio_15',
        amount: 15,
        validity: '1 day',
        description: '1GB data only',
        benefits: ['1GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'jio_25',
        amount: 25,
        validity: '1 day',
        description: '2GB data only',
        benefits: ['2GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'jio_61',
        amount: 61,
        validity: '7 days',
        description: '6GB data only',
        benefits: ['6GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'jio_91',
        amount: 91,
        validity: '28 days',
        description: '12GB data only',
        benefits: ['12GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'jio_151',
        amount: 151,
        validity: '30 days',
        description: '20GB data only',
        benefits: ['20GB data', 'No Voice/SMS'],
        type: 'data'
      },
      // Top Up Plans
      {
        id: 'jio_10',
        amount: 10,
        validity: '7 days',
        description: 'Top up for special tariff',
        benefits: ['₹8.5 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'jio_20',
        amount: 20,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹17 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'jio_50',
        amount: 50,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹39 talk time', 'Special tariff'],
        type: 'topup'
      }
    ],
    'Airtel': [
      // Full Talktime Plans
      {
        id: 'airtel_155',
        amount: 155,
        validity: '30 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'Airtel Thanks'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'airtel_179',
        amount: 179,
        validity: '28 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_265',
        amount: 265,
        validity: '30 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_299',
        amount: 299,
        validity: '28 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_359',
        amount: 359,
        validity: '28 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_449',
        amount: 449,
        validity: '84 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Airtel Thanks'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'airtel_509',
        amount: 509,
        validity: '84 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_549',
        amount: 549,
        validity: '56 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_839',
        amount: 839,
        validity: '84 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_999',
        amount: 999,
        validity: '84 days',
        description: 'Unlimited Voice + 3GB/day data',
        benefits: ['Unlimited Voice', '3GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_1799',
        amount: 1799,
        validity: '365 days',
        description: 'Unlimited Voice + 24GB data',
        benefits: ['Unlimited Voice', '24GB total data', '3600 SMS', 'Airtel Thanks'],
        type: 'fulltt'
      },
      {
        id: 'airtel_2999',
        amount: 2999,
        validity: '365 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'Airtel Thanks'],
        type: 'fulltt'
      },
      // Data Plans
      {
        id: 'airtel_19',
        amount: 19,
        validity: '1 day',
        description: '1GB data only',
        benefits: ['1GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'airtel_29',
        amount: 29,
        validity: '1 day',
        description: '2GB data only',
        benefits: ['2GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'airtel_65',
        amount: 65,
        validity: '28 days',
        description: '4GB data only',
        benefits: ['4GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'airtel_118',
        amount: 118,
        validity: '28 days',
        description: '12GB data only',
        benefits: ['12GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'airtel_181',
        amount: 181,
        validity: '30 days',
        description: '30GB data only',
        benefits: ['30GB data', 'No Voice/SMS'],
        type: 'data'
      },
      // Top Up Plans
      {
        id: 'airtel_23',
        amount: 23,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹18.33 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'airtel_35',
        amount: 35,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹26.23 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'airtel_79',
        amount: 79,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹64.34 talk time', 'Special tariff'],
        type: 'topup'
      }
    ],
    'Vi': [
      // Full Talktime Plans
      {
        id: 'vi_179',
        amount: 179,
        validity: '28 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'vi_199',
        amount: 199,
        validity: '30 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_269',
        amount: 269,
        validity: '28 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_299',
        amount: 299,
        validity: '28 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_359',
        amount: 359,
        validity: '28 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_379',
        amount: 379,
        validity: '28 days',
        description: 'Unlimited Voice + 2.5GB/day data',
        benefits: ['Unlimited Voice', '2.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_479',
        amount: 479,
        validity: '56 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'vi_539',
        amount: 539,
        validity: '56 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_699',
        amount: 699,
        validity: '84 days',
        description: 'Unlimited Voice + 1.5GB/day data',
        benefits: ['Unlimited Voice', '1.5GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_839',
        amount: 839,
        validity: '84 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_1449',
        amount: 1449,
        validity: '180 days',
        description: 'Unlimited Voice + 24GB data',
        benefits: ['Unlimited Voice', '24GB total data', '3600 SMS', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      {
        id: 'vi_3099',
        amount: 3099,
        validity: '365 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Vi Movies & TV'],
        type: 'fulltt'
      },
      // Data Plans
      {
        id: 'vi_17',
        amount: 17,
        validity: '1 day',
        description: '1GB data only',
        benefits: ['1GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'vi_27',
        amount: 27,
        validity: '2 days',
        description: '2GB data only',
        benefits: ['2GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'vi_58',
        amount: 58,
        validity: '28 days',
        description: '3GB data only',
        benefits: ['3GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'vi_118',
        amount: 118,
        validity: '28 days',
        description: '12GB data only',
        benefits: ['12GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'vi_181',
        amount: 181,
        validity: '30 days',
        description: '30GB data only',
        benefits: ['30GB data', 'No Voice/SMS'],
        type: 'data'
      },
      // Top Up Plans
      {
        id: 'vi_20',
        amount: 20,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹15.95 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'vi_30',
        amount: 30,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹22.85 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'vi_50',
        amount: 50,
        validity: '28 days',
        description: 'Top up for special tariff',
        benefits: ['₹37.14 talk time', 'Special tariff'],
        type: 'topup'
      }
    ],
    'BSNL': [
      // Full Talktime Plans
      {
        id: 'bsnl_107',
        amount: 107,
        validity: '35 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'Free roaming'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'bsnl_187',
        amount: 187,
        validity: '28 days',
        description: 'Unlimited Voice + 2GB/day data',
        benefits: ['Unlimited Voice', '2GB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      {
        id: 'bsnl_247',
        amount: 247,
        validity: '45 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      {
        id: 'bsnl_319',
        amount: 319,
        validity: '54 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      {
        id: 'bsnl_397',
        amount: 397,
        validity: '80 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'Free roaming'],
        popular: true,
        type: 'fulltt'
      },
      {
        id: 'bsnl_797',
        amount: 797,
        validity: '160 days',
        description: 'Unlimited Voice + 1GB/day data',
        benefits: ['Unlimited Voice', '1GB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      {
        id: 'bsnl_1999',
        amount: 1999,
        validity: '365 days',
        description: 'Unlimited Voice + 600MB/day data',
        benefits: ['Unlimited Voice', '600MB/day data', '100 SMS/day', 'Free roaming'],
        type: 'fulltt'
      },
      // Data Plans
      {
        id: 'bsnl_29',
        amount: 29,
        validity: '5 days',
        description: '1GB data only',
        benefits: ['1GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'bsnl_47',
        amount: 47,
        validity: '10 days',
        description: '2GB data only',
        benefits: ['2GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'bsnl_78',
        amount: 78,
        validity: '15 days',
        description: '5GB data only',
        benefits: ['5GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'bsnl_98',
        amount: 98,
        validity: '22 days',
        description: '10GB data only',
        benefits: ['10GB data', 'No Voice/SMS'],
        type: 'data'
      },
      {
        id: 'bsnl_147',
        amount: 147,
        validity: '30 days',
        description: '25GB data only',
        benefits: ['25GB data', 'No Voice/SMS'],
        type: 'data'
      },
      // Top Up Plans
      {
        id: 'bsnl_22',
        amount: 22,
        validity: '5 days',
        description: 'Top up for special tariff',
        benefits: ['₹18.64 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'bsnl_56',
        amount: 56,
        validity: '10 days',
        description: 'Top up for special tariff',
        benefits: ['₹47.46 talk time', 'Special tariff'],
        type: 'topup'
      },
      {
        id: 'bsnl_112',
        amount: 112,
        validity: '21 days',
        description: 'Top up for special tariff',
        benefits: ['₹94.92 talk time', 'Special tariff'],
        type: 'topup'
      }
    ]
  };

  return commonPlans[operator] || [];
};
