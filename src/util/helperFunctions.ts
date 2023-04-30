// export const checkJwt = () => {
//     const allCookies = document.cookie.split('; ');
//     let cookies = {};
//     for (let i = 0; i < allCookies.length; i++) {
//         const currentCookie = allCookies[i].split('=');
//         cookies[currentCookie[0]] = currentCookie[1];
//     }
//     const jwtKey = 'roop-verma-library';
//     if (Object.keys(cookies).includes(jwtKey)) {
//         let currentJwt = cookies[jwtKey];
//         return currentJwt;
//     } else {
//         return false;
//     }
// };
// Make into hook??
// const searchTerm = 'ra';
let result: string[] = [];
let searchTerm = '';
let id = 0;

// @ts-expect-error
export function getEachItem(object, search) {
    result = [];
    searchTerm = search;

    // @ts-expect-error
    object.forEach((item) => {
        id = item.id;
        searchItem(item);
    });
    // let uniqueResults = [...new Set(result)];
    return result;
}

// @ts-expect-error
function searchItem(item) {
    Object.keys(item).forEach((key) => {
        if (typeof item[key] === 'object' && item[key] !== null) {
            searchItem(item[key]);
        }
        if (typeof item[key] === 'string') {
            let searchAsRegEx = new RegExp(searchTerm, 'gi');
            if (item[key].match(searchAsRegEx)) {
                // @ts-expect-error
                !result.includes(item.id) && result.push(id);
            }
        }
    });
}
