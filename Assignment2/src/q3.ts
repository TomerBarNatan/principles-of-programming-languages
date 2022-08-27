import {map} from "ramda";
import { ClassExp, Exp, Program, CExp,VarRef, VarDecl, makeProcExp, makeAppExp, isBoolExp, isNumExp, isPrimOp, isVarRef, isVarDecl, isIfExp, isAppExp, isProcExp, isClassExp, makeIfExp, isDefineExp, makeDefineExp, isProgram, makeProgram, ProcExp, makeVarDecl, LitExp, Binding, makeLitExp, IfExp, makeBoolExp, makeVarRef, isStrExp, isLetExp, isLitExp} from "./L31-ast";
import { Result, makeOk, makeFailure, safe3, safe2, mapResult, bind } from "../shared/result";
import { makePrimOp } from "../imp/L3-ast";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>{
    const cases : LitExp[] = map((b: Binding) => makeLitExp(b.var.var,), exp.methods);
    const applys : CExp[] = map((b: Binding)=>b.val, exp.methods);
    return makeProcExp(exp.fields,[makeProcExp([makeVarDecl("msg")],[recursiveCondExp(makeVarRef("msg"),cases,applys)])]);
}
export const recursiveCondExp = (ref: VarRef, cases:LitExp[], applys: CExp[]): IfExp =>
    {   
        const val : LitExp = cases[0];
        const test : CExp = makeAppExp(makePrimOp("eq?"),[makeVarRef('msg'),makeLitExp(`'${val.val}`)])
        return cases.length === 1 && isAppExp(applys[0])? makeIfExp(test, isAppExp(applys[0])? makeAppExp(applys[0].rands[0],[]) : makeBoolExp(false) , makeBoolExp(false)):
            makeIfExp(test, isAppExp(applys[0])? makeAppExp(applys[0].rands[0],[]) : makeBoolExp(false), recursiveCondExp(ref, cases.slice(1), applys.slice(1)))}

export const L31ToL3CExp = (exp: CExp): Result<CExp> =>
    isBoolExp(exp) ? makeOk(exp) :
    isNumExp(exp) ? makeOk(exp) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? makeOk(exp) :
    isVarDecl(exp) ? makeOk(exp) :
    isIfExp(exp) ?  safe3((test: CExp, then: CExp, alt: CExp) => makeOk(makeIfExp(test, then, alt)))
                    (L31ToL3CExp(exp.test), L31ToL3CExp(exp.then), L31ToL3CExp(exp.alt)) :
    isAppExp(exp) ? safe2((rator: CExp, rands: CExp[]) => makeOk(makeAppExp(rator, rands)))
                    (L31ToL3CExp(exp.rator), mapResult(L31ToL3CExp, exp.rands)) :
    isProcExp(exp) ? safe2((args: VarDecl[], body: CExp[]) => makeOk(makeProcExp(args, body)))
                    (mapResult(makeOk,(exp.args)), (mapResult(L31ToL3CExp,(exp.body)))):
    isClassExp(exp) ? L31ToL3CExp(class2proc(exp)) :
    isLetExp(exp) ? makeOk(exp):
    isStrExp(exp) ? makeOk(exp):
    isLitExp(exp) ? makeOk(exp):
    makeFailure("Unexpected expression " + exp);

export const L31ToL3Exp = (exp: Exp): Result<Exp> => {
    return  isDefineExp(exp) ? bind(L31ToL3CExp(exp.val), (val:CExp) => makeOk(makeDefineExp(exp.var, val))) :
    L31ToL3CExp(exp);
}


/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
        {return isProgram(exp) ? bind(mapResult(L31ToL3Exp, exp.exps) ,(x: Exp[]) => makeOk(makeProgram(x))):
            L31ToL3Exp(exp)}
