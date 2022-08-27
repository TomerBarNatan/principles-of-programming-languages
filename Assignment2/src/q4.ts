import { Result, makeOk, bind, makeFailure, safe2, safe3, mapResult } from '../shared/result';
import {isAppExp, isBoolExp, isNumExp, isPrimOp, isVarRef, isIfExp, isProgram,isDefineExp, isProcExp, Exp, Program} from "../imp/L3-ast";
import { map, reduce, concat } from "ramda";
/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
    isProgram(exp) ? bind(mapResult(l2ToPython, exp.exps), (exps: string[]) => exps.length === 1 ? makeOk(exps[exp.exps.length-1]) : makeOk(`${reduce(concat, "",[exps.slice(0, exps.length-1).join("\n"), "\n",exps[exp.exps.length-1]])}`)) :
    isBoolExp(exp) ? makeOk(exp.val ? "true" : "false") :
    isNumExp(exp) ? makeOk(exp.val.toString()):
    isVarRef(exp) ? makeOk(exp.var) :
    isPrimOp(exp) ? (exp.op === "=" ? makeOk ("=="): exp.op === "not" ? makeOk("not ") : exp.op === "and" ? makeOk("and ") : exp.op === "or" ? makeOk("or "):  exp.op === "eq?" ? makeOk("==") :  exp.op === "boolean?"? makeOk("(lambda x : (type(x) == bool)"): exp.op === "number?"? makeOk("(lambda x : (type(x) == int)") :makeOk(exp.op.toString())) :  
    isDefineExp(exp) ? bind(l2ToPython(exp.val), (val: string) => makeOk(`${exp.var.var} = ${val}`)) :
    isProcExp(exp) ? bind(mapResult(l2ToPython, exp.body), (body: string[]) => makeOk(`(lambda ${map(v => v.var, exp.args).join(",")} : ${body[0]})`)) :
    isIfExp(exp) ? safe3((test: string, then: string, alt: string) => makeOk(`(${then} if ${test} else ${alt})`))(l2ToPython(exp.test), l2ToPython(exp.then), l2ToPython(exp.alt)) :
    isAppExp(exp) ? safe2((rator: string, rands: string[]) => 
                ((isPrimOp(exp.rator) && (exp.rator.op === "number?")) ? makeOk((`(type(${rands}) == int)`)) :
                (isPrimOp(exp.rator) && (exp.rator.op === "boolean?")) ? makeOk((`(type(${rands} == bool)`)) :
                (isPrimOp(exp.rator) && exp.rator.op === "not") ? makeOk(`(${rator}${rands[0]})`)  :isPrimOp(exp.rator) && exp.rator.op !== "not"  ?makeOk(`(${rands.join(` ${rator} `)})`) : makeOk(`${rator}(${rands.join(",")})`)))
                (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands)):
    makeFailure(`Unknown expression: ${exp}`);