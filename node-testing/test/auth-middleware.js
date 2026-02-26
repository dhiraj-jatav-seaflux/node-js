const authMiddleware = require("../middleware/is-auth");
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const expect = require("chai").expect;

describe("Auth middleware", function () {
  it("should throw an error if no authorization is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("Should throw an error if the authorization header is only on string", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('Should yield userId after decoding the token',function(){
    const req = {
        get:function(headerName){
            return 'Bearer kasdjnkdfjvnjkanv'
        }
    }
    sinon.stub(jwt,'verify')
    // jwt.verify = function(){
    //     return {userId:'abc'}
    // }
    jwt.verify.returns({userId:'abc'})

    authMiddleware(req,{},()=>{});
    expect(req).to.have.property('userId');
    jwt.verify.restore()
  })

  it('Should throw an error if the token cannot be verified',function(){
    const req = {
        get:function(headerName){
            return 'Bearer xyz'
        }
    }
    expect(authMiddleware.bind(this,req,{},()=>{})).to.throw()
  })
});
