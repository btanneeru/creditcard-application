exports.calculateApproveLimit = async (annualIncome) => {
  try {
    if (annualIncome <= 200000) {
      return 50000;
    } else if (annualIncome >= 200000 && annualIncome < 300000) {
      return 75000;
    } else if (annualIncome >= 250000 && annualIncome < 500000) {
      return 35000;
    } else if (annualIncome >= 300000 && annualIncome < 500000) {
      return 1000000;
    } else {
      return "Income above 5L requires manual assessment";
    }
  } catch (error){
   console.log("Error in calculateApproveLimit: ", error);
   return false;
  }
}

exports.checkIsAtLeast18 = (dobStr) => {
  // dobStr format: DD-MM-YYYY
  const [day, month, year] = dobStr.split("-").map(Number);

  const dob = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age >= 18;
}

