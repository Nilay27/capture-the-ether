import fs from 'fs'
import parseMD from 'parse-md'

const fileContents = fs.readFileSync('./README.md', 'utf8')
const { metadata, content } = parseMD(fileContents)
