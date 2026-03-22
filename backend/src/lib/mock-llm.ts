// TODO: Desmockar
class MockLLM {
  private responses: string[];

  constructor(responses: string[]) {
    this.responses = responses;
  }
  public query(_prompt: string) {
    const response = this.responses.pop();
    return response;
  }
}

export default MockLLM;
