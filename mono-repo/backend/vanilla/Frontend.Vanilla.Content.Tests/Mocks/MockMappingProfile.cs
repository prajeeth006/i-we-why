using Frontend.Vanilla.Content.Templates.Mapping;

namespace Frontend.Vanilla.Content.Tests.Mocks;

public class MockMappingProfile : DefaultTemplateMappingProfile
{
    protected override void OnMap()
    {
        MapFieldsOfType("Date", Converters.DateTime);
        MapFieldsOfType("Rich Text", Converters.String);
        MapTemplate("MockTemplate", template => { });
    }
}
