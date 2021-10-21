set arg1=%1
set arg2=%2

if arg1==commit (git add . && git commit -m arg2 && git pull origin && git push origin --all) else if arg1==pull git pull origin