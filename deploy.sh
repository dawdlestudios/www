#!/usr/bin/env bash

bun run build
rsync -avzP dist/ dawdle:~/sites/dawdle.space
