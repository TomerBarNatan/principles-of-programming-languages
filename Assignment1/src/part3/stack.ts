import { State, bind } from "./state";

export type Stack = number[];

export const push: (x: number) => State<Stack,number> = function(x: number){
    return (st: Stack)=> {return [st.reduce((acc:number[],curr:number)=> acc.concat(curr),[x]),st[st.length]]};
};

export const pop: State<Stack,number>= function(st: Stack){
    return [st.reduce((acc:number[],curr:number,inx)=> inx===0? []:acc.concat(curr),[]),st[0]];
};

export const stackManip: State<Stack,number> = function(st: Stack) {
    return bind(pop, x=>bind(push(x*x),y=>bind(pop, z=>push(x+z))))(st)
};