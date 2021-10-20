if [ "$1" == 'commit' ]
then
    git add .
    git commit -m "$2"
    git pull remote origin
    git push remote origin --all
elif [ "$1" == 'pull' ]
then
    git pull origin
fi
