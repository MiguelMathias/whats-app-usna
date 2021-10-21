if [ "$1" == 'commit' ]
then
    git add . && git commit -m "$2" && git pull origin && git push origin --all
elif [ "$1" == 'pull' ]
then
    git pull origin
elif [ "$1" == 'host' ]
then
    ionic build --prod && firebase deploy --only hosting
elif [ "$1" == 'finish' ]
then
    git add . && git commit -m "$2" && git pull origin && git push origin --all && ionic build --prod && firebase deploy --only hosting
fi
