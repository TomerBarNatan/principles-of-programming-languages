import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
const voweles : string[] = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
export const countVowels:(s: string) => number = (s) => {
    return stringToArray(s).reduce((acc:number,curr:string)=> voweles.includes(curr)? acc+1 : acc,0) } ;

/* Question 2 */
const cut_list : (starr : string[]) => string[] = function(starr : string[]){
    return starr.filter(x=> x!=starr[0]).length === 0 ? [] : R.slice(starr.indexOf(starr.filter(x=> x!=starr[0])[0]), Infinity, starr)
};

const rec_built : (starr: string[]) => string = function(starr: string[]){
    if(starr.length === 0){
        return '';
    }
    if(starr.length === 1){
        return starr[0];
    }
    return starr.length - cut_list(starr).length!=1?
            starr[0] + (starr.length - cut_list(starr).length) + rec_built(cut_list(starr)):starr[0]+ rec_built(cut_list(starr))
};

export const runLengthEncoding:(s:string)=> string = (s) => {
    return rec_built(stringToArray(s))
};

/* Question 3 */
const accum : (acc : number[], s : string) => number[] = function(acc : number[], s : string){
    switch (s) {
        case "(":return [acc[0]+1,acc[1],acc[2],acc[3]];
        case ")":return [acc[0]-1,acc[1],acc[2],acc[3]];
        case "[":return [acc[0],acc[1]+1,acc[2],acc[3]];
        case "]":return [acc[0],acc[1]-1,acc[2],acc[3]];
        case "{":return [acc[0],acc[1],acc[2]+1,acc[3]];
        case "}":return [acc[0],acc[1],acc[2]-1,acc[3]];
        default: return acc;
    }
};

const rec_accume : (acc: number[], starr : string[]) => number[] = function(acc: number[], starr : string[]){
    if(starr.length === 1){
        return accum(acc, starr[0])
    }
    const new_acc : number[] = (acc[0]<0 || acc[1]<0 || acc[2]< 0)? accum([acc[0],acc[1],acc[2],-1], starr[0]): accum(acc, starr[0]);
    return rec_accume(new_acc, starr.slice(1))
};
export const isPaired: (s:string) => boolean = function(s:string) {
    const acc = rec_accume([0,0,0,0,],stringToArray(s));
    return acc[0]===0 && acc[1] ===0 && acc[2]===0 && acc[3]===0
};