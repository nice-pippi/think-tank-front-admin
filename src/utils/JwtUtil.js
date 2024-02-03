import jwt_decode from 'jwt-decode';

export function getLoginId(token) {
    if (token) {
        try {
            const jwt= jwt_decode(String(token))
            return jwt.loginId
        } catch {
            alert('token非法!')
        }
    } else {
        alert('token不存在!')
    }

}