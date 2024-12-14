#!/usr/bin/env nu
do { npm run build } | complete | select stdout stderr | to text | pbcopy
