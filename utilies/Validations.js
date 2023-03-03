//validate email
export const isValidEmail = (stringEmail) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(stringEmail))
}
//2124802010067@student.tdmu.edu.vn
//validate password
export const isValidPassword = (stringPassword) => stringPassword.length >= 8