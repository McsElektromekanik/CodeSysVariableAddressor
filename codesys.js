const CodeSysType = {
  NotFound: "NotFound",
  Int: "Int",
  Real: "Real",
  Bool: "Bool",
  Dint: "Dint",
};

const typeId = {
  [CodeSysType.Bool]: "MX",
  [CodeSysType.Int]: "MW",
  [CodeSysType.Real]: "MD",
  [CodeSysType.Dint]: "MD",
};

const stringTypePairs = {
  int: CodeSysType.Int,
  real: CodeSysType.Real,
  bool: CodeSysType.Bool,
  dint: CodeSysType.Dint,
};

const replacements = {
  İ: "I",
  ı: "i",
  ü: "u",
  Ü: "U",
  ö: "o",
  Ö: "O",
  ç: "c",
  Ç: "C",
  ğ: "g",
  Ğ: "G",
  Ş: "S",
  ş: "s",
};

class CodeSysVariable {
  constructor() {
    this.name = "";
    this.wordAddress = -1;
    this.codeSysType = CodeSysType.NotFound;
  }

  static getVariable(displayName) {
    const name = this.decomposeName(displayName);
    const type = this.decomposeCodeSysType(displayName);
    const address = this.decomposeAddress(displayName);

    let variable;
    if (type === CodeSysType.Bool) {
      variable = new BoolCodeSysVariable();
      const bitNumber = this.decomposeBitNumber(displayName);
      variable.bitNumber = bitNumber;
    } else {
      variable = new CodeSysVariable();
    }

    variable.name = name;
    variable.codeSysType = type;
    variable.wordAddress = address;

    return variable;
  }

  static decomposeName(displayName) {
    let buffer = displayName.trim();
    if (buffer.includes(":")) {
      buffer = buffer.split(":")[0];
    }
    const whiteSpaceIndex = buffer.search(/\s/);
    return whiteSpaceIndex > 0 ? buffer.substring(0, whiteSpaceIndex) : buffer;
  }

  static decomposeCodeSysType(displayName) {
    let buffer = displayName.trim();
    if (buffer.includes(":")) {
      const split = buffer.split(":");
      buffer = split[1].trim().replace(";", "").toLowerCase();
    }
    return stringTypePairs[buffer] || CodeSysType.NotFound;
  }

  static decomposeAddress(displayName) {
    let buffer = displayName.trim();
    if (buffer.includes(":")) {
      buffer = buffer.split(":")[0];
      if (buffer.includes("%")) {
        buffer = buffer.split("%")[1];
      }
      if (buffer.includes(".")) {
        buffer = buffer.split(".")[0];
      }
    }
    buffer = buffer.trim();
    let result = parseInt(buffer.substring(2)) || -1;

    const type = this.decomposeCodeSysType(displayName);
    if (type === CodeSysType.Bool) {
      result = Math.floor(result / 2);
    } else if (type === CodeSysType.Real || type === CodeSysType.Dint) {
      result *= 2;
    }
    return result;
  }

  static decomposeBitNumber(displayName) {
    let buffer = displayName.trim();
    if (buffer.includes(":")) {
      buffer = buffer.split(":")[0];
      if (buffer.includes("%")) {
        buffer = buffer.split("%")[1];
      }
      if (buffer.includes(".")) {
        buffer = buffer.split(".")[1];
      }
    }
    buffer = buffer.trim();
    return parseInt(buffer) || -1;
  }

  static getATDeclaration(type) {
    return typeId[type] || "";
  }

  static wordAddressToString(address, type) {
    let result = address.toString();
    if (type === CodeSysType.Bool) {
      result = (address * 2).toString();
    } else if (type === CodeSysType.Real || type === CodeSysType.Dint) {
      result = Math.floor(address / 2).toString();
    }
    return result;
  }

  fitCharsEnglish(str) {
    return str.replace(/[İıüÜöÖçÇğĞŞş]/g, (char) => replacements[char] || char);
  }

  getVariableDefinitionString() {
    return `IVariable ${this.name}{get;set;}`;
  }

  getVariableCreationString(read = null) {
    return `${this.name}=${this.getVarType(read)}`;
  }

  getVariableCreationString2(read = null) {
    return `${this.getVarType(read)}`;
  }

  getVarType(read = null) {
    const adrType = this.codeSysType === CodeSysType.Int ? "MW" : "MD";
    const varType =
      this.codeSysType === CodeSysType.Dint
        ? "DINT"
        : this.codeSysType === CodeSysType.Int
        ? "INT"
        : "REAL";

    return `VariableHelper.Define("${
      this.name
    } AT%${adrType}${CodeSysVariable.wordAddressToString(
      this.wordAddress,
      this.codeSysType
    )} : ${varType}"${read ? ", true" : ""})`;
  }

  getDisplayName() {
    return `${this.fitCharsEnglish(
      this.name
    )} AT%${CodeSysVariable.getATDeclaration(
      this.codeSysType
    )}${CodeSysVariable.wordAddressToString(
      this.wordAddress,
      this.codeSysType
    )}:${this.codeSysType};`;
  }
}

class BoolCodeSysVariable extends CodeSysVariable {
  constructor() {
    super();
    this.bitNumber = -1;
  }

  getVarType(read = null) {
    return `VariableHelper.Define("${
      this.name
    } AT%MX${CodeSysVariable.wordAddressToString(
      this.wordAddress,
      this.codeSysType
    )}.${this.bitNumber} : BOOL"${read ? ", true" : ""})`;
  }

  getDisplayName() {
    return `${this.fitCharsEnglish(
      this.name
    )} AT%${CodeSysVariable.getATDeclaration(
      this.codeSysType
    )}${CodeSysVariable.wordAddressToString(
      this.wordAddress,
      this.codeSysType
    )}.${this.bitNumber}:${this.codeSysType};`;
  }
}

// Dışa aktarma
window.CodeSysVariable = CodeSysVariable;
window.BoolCodeSysVariable = BoolCodeSysVariable;
window.CodeSysType = CodeSysType;
