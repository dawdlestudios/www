#!/usr/bin/env bash

bun run build
rsync -avzP dist/ genoa:~/dawdle/.files/home/henry/sites/dawdle.space
