
// Utility to generate realistic consumer names for electricity bills
const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Kavita', 'Suresh', 'Meera',
  'Rahul', 'Anjali', 'Anil', 'Pooja', 'Sanjay', 'Rekha', 'Deepak', 'Nisha',
  'Manish', 'Shanti', 'Ravi', 'Geeta', 'Prakash', 'Usha', 'Ashok', 'Lata',
  'Vinod', 'Sita', 'Mohan', 'Asha', 'Kiran', 'Maya', 'Naresh', 'Seema',
  'Ajay', 'Ritu', 'Satish', 'Neha', 'Ramesh', 'Vandana', 'Manoj', 'Aruna',
  'Dinesh', 'Shobha', 'Rohit', 'Sudha', 'Hemant', 'Veena', 'Pankaj', 'Sarita',
  'Yogesh', 'Rashmi', 'Sachin', 'Preeti', 'Nitin', 'Smita', 'Gopal', 'Renu'
];

const lastNames = [
  'Kumar', 'Sharma', 'Singh', 'Gupta', 'Agarwal', 'Yadav', 'Verma', 'Jain',
  'Patel', 'Shah', 'Mehta', 'Modi', 'Pandey', 'Mishra', 'Tiwari', 'Joshi',
  'Reddy', 'Rao', 'Nair', 'Menon', 'Iyer', 'Krishnan', 'Das', 'Banerjee',
  'Mukherjee', 'Roy', 'Bose', 'Ghosh', 'Chatterjee', 'Bhattacharya', 'Dutta', 'Sen',
  'Khan', 'Ahmed', 'Ali', 'Hussain', 'Ansari', 'Qureshi', 'Malik', 'Sheikh'
];

export const generateConsumerName = (consumerId: string): string => {
  // Use consumer ID to generate consistent name
  const idHash = consumerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const firstNameIndex = idHash % firstNames.length;
  const lastNameIndex = (idHash * 7) % lastNames.length;
  
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
};

export const generateBillNumber = (consumerId: string, board: string): string => {
  const boardPrefix = board.substring(0, 3).toUpperCase();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomSuffix = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return `${boardPrefix}${currentMonth.toString().padStart(2, '0')}${currentYear}${randomSuffix}`;
};
