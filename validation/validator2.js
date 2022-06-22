function Validator(formSelector, options) {
  //  Gán giá trị mặc định cho tham sối
  if (!options) {
    options = {};
  }
  function getParentElement(inputElement, selector) {
    // var errorElement = inputElement.parentElement.querySelector(options.errSelector.)
    while (inputElement.parentElement) {
      if (inputElement.parentElement.matches(selector)) {
        return inputElement.parentElement;
      }
      inputElement = inputElement.parentElement;
    }
  }
  var formRules = {};
  //  Quy ước tạo rule
  // có lỗi return error message
  //return true ewwwhen error message

  var validatorRules = {
    Required: function (value) {
      return value ? undefined : "Vui lòng nhập trường này";
    },
    email: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Vui lòng nhập email";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Vui lòng nhập tối đa ${min} kí tự`;
      };
    },
    max: function (max) {
      return function (value) {
        return value.length <= max
          ? undefined
          : `Vui lòng nhập tối đa ${max} kí tự`;
      };
    },
  };

  //  lấy form element theo formSelector
  var formElement = document.querySelector(formSelector);
  //  Chỉ sử lý khi có elements trong Dom
  if (formElement) {
    var inputs = formElement.querySelectorAll("[name][rules]");
    for (var input of inputs) {
      var rules = input.getAttribute("rules").split("|");
      for (var rule of rules) {
        var ruleInfo;
        var isRuleHasValue = rule.includes(":");

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
          //   console.log(validatorRules[rule](ruleInfo[1]))
        }
        var ruleFunc = validatorRules[rule];

        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      // Lắng nghe sự kiện để validate( onblur onchange)
      input.onblur = handleValidate;
      input.oninput = handleClearErr;
    }
    //  Hàm thực hiện validate
    function handleValidate(e) {
      var rules = formRules[e.target.name];
      var errMessage = undefined;
      for (rule of rules) {
        var resultRule = rule(e.target.value);
        if (resultRule) {
          errMessage = resultRule;
          break;
        }
      }
      if (errMessage) {
        var formGroup = getParentElement(e.target, ".form-group");
        if (formGroup) {
          formGroup.classList.add("invalid");
          var formMessage = formGroup.querySelector(".form-message");
          if (formMessage) {
            formMessage.innerText = errMessage;
          }
        }
      } else handleClearErr(e);
      return !errMessage;
    }
    function handleClearErr(e) {
      var formGroup = getParentElement(e.target, ".form-group");
      var formMessage = formGroup.querySelector(".form-message");
      formGroup.classList.remove("invalid");
      if (formMessage) {
        formMessage.innerText = "";
      }
    }
    // console.log(formRules);
  }

  //    Xử lý hành vi submit
  formElement.onsubmit = function (e) {
    e.preventDefault();
    var inputs = formElement.querySelectorAll("[name][rules]");
    var isValid = true;
    for (var input of inputs) {
      if (!handleValidate({ target: input })) {
        var isValid = false;
      }
      console.log()
      if (isValid) {
        if (typeof options.onSubmit === "function"){options.onSubmit('ádasd');}
         else {
            formElement.submit();
          }
        }

      } 
  };
}
