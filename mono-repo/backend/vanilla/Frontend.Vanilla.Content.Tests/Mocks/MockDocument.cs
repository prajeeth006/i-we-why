using Frontend.Vanilla.Content.Templates.Mapping;

namespace Frontend.Vanilla.Content.Tests.Mocks;

[SitecoreTemplate("MockTemplate", typeof(MockMappingProfile))]
public interface IMockTemplate : IDocument
{
    string Name { get; }
    decimal Amount { get; }
    bool IsVisible { get; }
}

[SitecoreTemplate("MockTemplate", typeof(MockMappingProfile))]
public class MockTemplateDocument : Document, IMockTemplate
{
    public string Name
    {
        get { return GetValue<string>("Name"); }
    }

    public decimal Amount
    {
        get { return GetValue<decimal>("Amount"); }
    }

    public bool IsVisible
    {
        get { return GetValue<bool>("IsVisible"); }
    }

    public MockTemplateDocument(DocumentData documentData)
        : base(documentData) { }
}
