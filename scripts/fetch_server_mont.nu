let base_url = "https://raw.githubusercontent.com/internet-development/www-server-mono/main/fonts"
let files = [
    "ServerMono-Regular-Italic.otf"
    "ServerMono-Regular-Italic.woff"
    "ServerMono-Regular-Italic.woff2"
    "ServerMono-Regular.otf"
    "ServerMono-Regular.woff" 
    "ServerMono-Regular.woff2"
]

mkdir www/assets/fonts
cd www/assets/fonts

$files | each { |file|
    http get $"($base_url)/($file)" | save $file
    print $"Downloaded ($file)"
}