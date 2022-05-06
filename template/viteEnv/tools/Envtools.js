import fs from 'fs'
import path from 'path'
import os from 'os'
import dotenv from 'dotenv'; //环境变量


/**
 * 注册环境变量 替代dotenv
 * Envtools.getNodeEnv([".env." + mode])
 * @param {Array[String]} envNameList 
 */
function getNodeEnv(envNameList) {
  config()
  for (let index = 0; index < envNameList.length; index++) {
    const envName = envNameList[index]; // '.env.development'
    config({ path: path.resolve(process.cwd(), envName) })
  }
}








// Parser src into an Object
function paraseEnvConfig(src) {
  const obj = {}
  let lines = src.toString() // Convert buffer to string
  lines = lines.replace(/\r\n?/mg, '\n') // Convert line breaks to same format

  let match
  const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]
    let value = (match[2] || '') // Default undefined or null to empty string
    value = value.trim() // Remove whitespace
    const maybeQuote = value[0] // Check if double quoted
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2') // Remove surrounding quotes

    if (maybeQuote === '"') { // Expand newlines if double quoted
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }
    obj[key] = value // Add to object
  }

  return obj
}

function _log(message) {
  console.log(`[dotenv][DEBUG] ${message}`)
}

function _resolveHome(envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config(options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  const debug = Boolean(options && options.debug)
  const override = Boolean(options && options.override)

  if (options) {
    if (options.path != null) dotenvPath = _resolveHome(options.path)
    if (options.encoding != null) encoding = options.encoding
  }

  try {
    const parsed = paraseEnvConfig(fs.readFileSync(dotenvPath, { encoding })) // Specifying an encoding returns a string instead of a buffer

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else {
        if (override === true) process.env[key] = parsed[key]

        if (debug) {
          override === true ?
            _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`) :
            _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`)

        }
      }
    })

    return { parsed }
  } catch (e) {
    if (debug) _log(`Failed to load ${dotenvPath} ${e.message}`)
    return { error: e }
  }
}

const Envtools = {
  getNodeEnv,
  // Dotenv
  config,
  paraseEnvConfig
}

export { Envtools }




// /**
//  * TODO #号待解决
//  * 根据路径原生解析键值对
//  * @param {String} filename 
//  * @returns 
//  */
//  function paraseEnvConfig(filename) {
//   if (!fs.existsSync(filename)) return false //路径是否存在
//   const content = fs.readFileSync(filename, 'utf-8')
//   console.log(content)
//   /** 解析环境变量内容 */
//   const obj = {}
//   const regExp = '(\\S+)\\s*=\\s*[\'|\"]?(\\S+)[\'|\"]?'
//   const list = content.match(new RegExp(regExp, 'g'))
//   console.log(list)
//   list &&
//     list.forEach((item) => {
//       const data = item.match(new RegExp(regExp))
//       const key = data ? data[1].trim() : undefined
//       const value = data ? data[2].trim() : undefined
//       key && (obj[key] = value)
//     })
//   return obj
// }