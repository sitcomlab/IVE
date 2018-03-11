#!/bin/bash
for f in `find public/videos/* -maxdepth 1 -type f -name '*.mp4' -exec ls {} \;`
do
	echo $(basename ${f%.mp4})
    b=$(basename ${f%.mp4})
    if [ ! -d "public/thumbnails/geo-1/${b}" ]; then
        mkdir public/thumbnails/${b}
		ffmpeg -ss 1 -i ${f} -vf scale="480:-1, fps=1/1" public/thumbnails/${b}/%d.jpg
		echo \n
		ffmpeg -ss 1 -i ${f} -vframes 1 public/thumbnails/${b}/poster.jpg
		echo \n
		echo \n
    fi
done
