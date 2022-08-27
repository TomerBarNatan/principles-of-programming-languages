:- module('ex5',
        [author/2,
         genre/2,
         book/4
        ]).

/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).
:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).



author(1, "Isaac Asimov").
author(2, "Frank Herbert").
author(3, "William Morris").
author(4, "J.R.R Tolkein").


genre(1, "Science").
genre(2, "Literature").
genre(3, "Science Fiction").
genre(4, "Fantasy").

book("Inside The Atom", 1, 1, 500).
book("Asimov's Guide To Shakespeare", 1, 2, 400).
book("I, Robot", 1, 3, 450).
book("Dune", 2, 3, 550).
book("The Well at the World's End", 3, 4, 400).
book("The Hobbit", 4, 4, 250).
book("The Lord of the Rings", 4, 4, 1250).
book("Inside The Atom", 1, 1, 500).
book("Asimov's Guide To Shakespeare", 1, 2, 400).
book("I, Robot", 1, 3, 450).
book("Dune", 2, 3, 550).
book("The Well at the World's End", 3, 4, 400).
book("The Hobbit", 4, 4, 250).
book("The Lord of the Rings", 4, 4, 1250).


% You can add more facts.
% Fill in the Purpose, Signature as requested in the instructions here

% Signature: authorOfGenre(AuthorName, GenreName)/2
% Purpose: The relation in which author wrote a book of this genre.
%
authorOfGenre(G,A) :- author(P, A), genre(R, G), book(_,P,R,_).

% Signature:longestBook(AuthorId, BookName)/2
% Purpose: Gets true if the longest BookName is the longest book
% AuthorId wrote.
%
isMax([L], L).
isMax([X|Xs], L):- isMax(Xs, T), (X > T -> L = X ; L = T).
longestBook(A,B):- book(B,A,_,W),findall(L,book(_,A,_,L),Bag), isMax(Bag,W).




% Signature:longestBook(AuthorName)/1
% Purpose: Gets true if AuthorName wrote more then 2 books in different
% genre.
%

listBiggerThen3(_,N) :- N = 3.
listBiggerThen3([H|T], N) :- not(isInList(T,H)) ,N1 is N+1 ,listBiggerThen3(T, N1).
listBiggerThen3([_|T],N):- listBiggerThen3(T,N).
isInList([],_):-false.
isInList([H|_],E):- H = E.
isInList([_|T],E):- isInList(T,E).

versatileAuthor(A):- author(ID,A), findall(GID,book(_,ID,GID,_),Bag),listBiggerThen3(Bag,0).


