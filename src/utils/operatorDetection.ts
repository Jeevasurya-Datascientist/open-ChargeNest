
export interface Operator {
  name: string;
  logo: string;
  color: string;
}

export const operators: Record<string, Operator> = {
  'Jio': {
    name: 'Jio',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=center',
    color: '#0066cc'
  },
  'Airtel': {
    name: 'Airtel',
    logo: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop&crop=center',
    color: '#e60000'
  },
  'Vi': {
    name: 'Vi',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&crop=center',
    color: '#662d8c'
  },
  'BSNL': {
    name: 'BSNL',
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop&crop=center',
    color: '#1a4fa0'
  }
};

export const detectOperator = (number: string): string => {
  if (number.length < 10) return "";
  
  const cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length !== 10) return "";
  
  const firstFour = cleanNumber.substring(0, 4);
  const firstThree = cleanNumber.substring(0, 3);
  
  // Enhanced Jio patterns (more comprehensive)
  const jioPatterns = [
    '8910', '8911', '8912', '8913', '8914', '8915', '8916', '8917', '8918', '8919',
    '7023', '7024', '7025', '7026', '7027', '7028', '7029', '7030', '7031', '7032',
    '6350', '6351', '6352', '6353', '6354', '6355', '6356', '6357', '6358', '6359',
    '7710', '7711', '7712', '7713', '7714', '7715', '7716', '7717', '7718', '7719'
  ];
  
  // Enhanced Airtel patterns
  const airtelPatterns = [
    '9910', '9911', '9912', '9913', '9914', '9915', '9916', '9917', '9918', '9919',
    '7800', '7801', '7802', '7803', '7804', '7805', '7806', '7807', '7808', '7809',
    '8800', '8801', '8802', '8803', '8804', '8805', '8806', '8807', '8808', '8809',
    '9000', '9001', '9002', '9003', '9004', '9005', '9006', '9007', '9008', '9009',
    '7000', '7001', '7002', '7003', '7004', '7005', '7006', '7007', '7008', '7009'
  ];
  
  // Enhanced Vi patterns (including old Vodafone and Idea numbers)
  const viPatterns = [
    '9826', '9827', '9828', '9829', '9830', '9831', '9832', '9833', '9834', '9835',
    '7400', '7401', '7402', '7403', '7404', '7405', '7406', '7407', '7408', '7409',
    '9400', '9401', '9402', '9403', '9404', '9405', '9406', '9407', '9408', '9409',
    '8400', '8401', '8402', '8403', '8404', '8405', '8406', '8407', '8408', '8409',
    '9300', '9301', '9302', '9303', '9304', '9305', '9306', '9307', '9308', '9309'
  ];
  
  // Enhanced BSNL patterns
  const bsnlPatterns = [
    '9400', '9401', '9402', '9403', '9404', '9405', '9406', '9407', '9408', '9409',
    '6000', '6001', '6002', '6003', '6004', '6005', '6006', '6007', '6008', '6009',
    '9436', '9437', '9438', '9439', '9440', '9441', '9442', '9443', '9444', '9445',
    '7005', '7006', '7007', '7008', '7009', '7010', '7011', '7012', '7013', '7014'
  ];

  // Check patterns
  if (jioPatterns.some(pattern => firstFour.startsWith(pattern) || firstThree.startsWith(pattern.substring(0, 3)))) {
    return "Jio";
  }
  if (airtelPatterns.some(pattern => firstFour.startsWith(pattern) || firstThree.startsWith(pattern.substring(0, 3)))) {
    return "Airtel";
  }
  if (viPatterns.some(pattern => firstFour.startsWith(pattern) || firstThree.startsWith(pattern.substring(0, 3)))) {
    return "Vi";
  }
  if (bsnlPatterns.some(pattern => firstFour.startsWith(pattern) || firstThree.startsWith(pattern.substring(0, 3)))) {
    return "BSNL";
  }
  
  // Fallback detection based on common number ranges
  const prefix = cleanNumber.substring(0, 3);
  
  // Additional fallback patterns
  if (['700', '701', '702', '703', '630', '631', '632', '633', '634', '635', '771', '772', '773', '774', '775'].includes(prefix)) {
    return "Jio";
  }
  if (['900', '901', '902', '903', '780', '781', '782', '783', '880', '881', '882', '883'].includes(prefix)) {
    return "Airtel";
  }
  if (['740', '741', '742', '743', '840', '841', '842', '843', '930', '931', '932', '933'].includes(prefix)) {
    return "Vi";
  }
  if (['943', '944', '945', '946', '600', '601', '602', '603'].includes(prefix)) {
    return "BSNL";
  }
  
  return "Unknown";
};
