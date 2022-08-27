import { State, bind } from "./state";
import * as R from "ramda";

export type Queue = number[];

export const enqueue: (x: number)=> State<Queue,number> = function(x: number){
    return (q: Queue) => {
                return [R.append(x,q),q[q.length]];}
};

export const dequeue: State<Queue,number> = function(q: Queue){
    return [q.reduce((acc:Queue, curr: number, inx)=>inx===0? []:acc.concat(curr),[]),q[0]];
};

export const queueManip: State<Queue,number> = function(q: Queue){
    return bind(dequeue, x=>bind(enqueue(2*x), y=>bind(enqueue(x/3), z=>dequeue)))(q)
};