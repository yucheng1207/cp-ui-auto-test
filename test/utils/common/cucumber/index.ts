import { Given as G, IWorld, Then as T, When as W, defineStep as S } from '@cucumber/cucumber';
import {
  DefineStepPattern,
  TestStepFunction,
} from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { GherkinStepKeyword } from '@cucumber/cucumber/lib/models/gherkin_step_keyword';
import { orderDetail } from '../../stepUtils/createPayOrder';

export const Given = (
  pattern: DefineStepPattern,
  codePC: TestStepFunction<IWorld<any>>,
  codeH5?: TestStepFunction<IWorld<any>>,
) =>
  G(pattern, async (...args) => {
    if (orderDetail.platform === 'H5' && codeH5) {
      await codeH5.apply(this, args);
    } else {
      await codePC.apply(this, args);
    }
  });

export const Then = (
  pattern: DefineStepPattern,
  codePC: TestStepFunction<IWorld<any>>,
  codeH5?: TestStepFunction<IWorld<any>>,
) =>
  T.call(this, pattern, async (...args) => {
    if (orderDetail.platform === 'H5' && codeH5) {
      await codeH5.call(this, ...args);
    }
    await codePC.call(this, ...args);
  });

export const When = (
  pattern: DefineStepPattern,
  codePC: TestStepFunction<IWorld<any>>,
  codeH5?: TestStepFunction<IWorld<any>>,
) =>
  W(pattern, async (...args) => {
    if (orderDetail.platform === 'H5' && codeH5) {
      await codeH5.apply(this, args);
    } else {
      await codePC.apply(this, args);
    }
  });

export type StepConfig = {
  keyword?: GherkinStepKeyword;
  pattern: DefineStepPattern;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function;
};
function getCucumberDefineStepFn(keyword?: GherkinStepKeyword) {
  switch (keyword) {
    case 'Given':
      return G;
    case 'When':
      return W;
    case 'Then':
      return T;
    default:
      return S;
  }
}

export type CucumberStepFunction = TestStepFunction<IWorld<any>> & {
  stepConfig?: StepConfig;
};
export function buildCucumberStepCode(stepConfig: StepConfig) {
  const code: CucumberStepFunction = function (...args) {
    const fixtures = {
      // page: this.page
    }
    return stepConfig.fn.call(this, fixtures, ...args);
  };

  code.stepConfig = stepConfig;
  return code;
}
function defineStep(stepConfig: StepConfig) {
  const { keyword, pattern } = stepConfig;
  const cucumberDefineStepFn = getCucumberDefineStepFn(keyword);
  const code = buildCucumberStepCode(stepConfig);
  try {
    cucumberDefineStepFn(pattern, code);
  } catch (e) {
    console.error(e);
    throw e
  }
}

function defineStepCreator(keyword?: GherkinStepKeyword, ) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (pattern: DefineStepPattern, fn: Function) => {
    defineStep({
      keyword,
      pattern,
      fn,
    });
  }
}


export const myDefineStep = defineStepCreator()