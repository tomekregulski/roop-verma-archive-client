// import { useState } from 'react';
// import { Track } from '../context/trackTypes';

// function useSearchTracks(object: Track[], searchTerm: string) {
//   const [results, setResults] = useState<number[]>([]);
//   const [id, setId] = useState(0);

//   object.forEach((item) => {
//     id = item.id;
//     searchItem(item);
//   });
// }
// let result: string[] = [];
// let searchTerm = '';
// let id = 0;

// // @ts-expect-error typing here is terrible, need to fix
// export function getEachItem(object, search) {
//   result = [];
//   searchTerm = search;

//   // @ts-expect-error typing here is terrible, need to fix
//   object.forEach((item) => {
//     id = item.id;
//     searchItem(item);
//   });
//   // let uniqueResults = [...new Set(result)];
//   return result;
// }

// // @ts-expect-error typing here is terrible, need to fix
// function searchItem(item) {
//   Object.keys(item).forEach((key) => {
//     if (typeof item[key] === 'object' && item[key] !== null) {
//       searchItem(item[key]);
//     }
//     if (typeof item[key] === 'string') {
//       const searchAsRegEx = new RegExp(searchTerm, 'gi');
//       if (item[key].match(searchAsRegEx)) {
//         // @ts-expect-error typing here is terrible, need to fix
//         !result.includes(item.id) && result.push(id);
//       }
//     }
//   });
// }

// function searchRaga(tracks: Track[], term: string) {
//   const results = [];

//   tracks.forEach((track) => {
//     if (track.raga.name.includes(term)) {
//       results.push(track);
//     }
//   });
// }
