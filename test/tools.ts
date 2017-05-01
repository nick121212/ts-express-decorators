import * as Chai from "chai";
import * as Sinon from "sinon";
import * as SinonChai from "sinon-chai";
Chai.should();
Chai.use(SinonChai);
const expect = Chai.expect;
const assert = Chai.assert;

export {
    expect,
    assert,
    Sinon,
    SinonChai
};