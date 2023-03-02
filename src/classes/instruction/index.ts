import ExecutionContext from "../execution";
import { NotImplementedError } from "./errors";

interface ExecutionResult {
    gasFee: number;
}

class Instruction {
  public readonly opcode: number;
  public readonly name: string;
  public readonly execute: (ctx: ExecutionContext) => Promise<ExecutionResult>;

  constructor(
    opcode: number,
    name: string,
    gasFee: ((ctx: ExecutionContext) => Promise<number>) | number,
    execute: (ctx: ExecutionContext) => void
  ) {
    this.opcode = opcode;
    this.name = name;
    this.execute = async (ctx: ExecutionContext) => {
       const gasFeeFunction =
       typeof gasFee == "function" ? gasFee : () => gasFee;
       
       const effectGasFee = await gasFeeFunction(ctx);
       ctx.useGas(effectGasFee); //primero usemos el gas

       await execute(ctx);

       return {
        gasFee: effectGasFee,
       };
    };
  }
}

export default Instruction;