export type State<S, A> = (initialState: S) => [S, A];

export const bind:<S,A,B>(state: State<S,A>, f:(x: A)=>State<S,B>) => State<S,B> = function<S,A,B>(state: State<S,A>, f:((x: A)=>State<S,B>)){
    return ((s:S)=> { const [s1,a]: [S,A] = state(s); return f(a)(s1)})
};
