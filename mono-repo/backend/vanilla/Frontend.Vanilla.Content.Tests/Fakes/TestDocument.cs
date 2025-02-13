using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Tests.Fakes;

public class TestDocument : Document
{
    public TestDocument(DocumentData data)
        : base(data) { }
}

public class TestFilterableDocument : Document, IFilterTemplate
{
    public TestFilterableDocument(DocumentData data)
        : base(data) { }

    public string Condition => GetValue<string>("Condition");
}
