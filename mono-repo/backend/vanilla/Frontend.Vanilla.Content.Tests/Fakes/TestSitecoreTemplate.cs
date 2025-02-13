using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Tests.Fakes;

internal static class TestSitecoreTemplate
{
    public static SitecoreTemplate Get(
        string name = null,
        string source = null,
        IEnumerable<SitecoreTemplate> baseTmpls = null,
        IEnumerable<SitecoreTemplateField> fields = null)
        => new SitecoreTemplate(
            name ?? Guid.NewGuid().ToString(),
            source ?? Guid.NewGuid().ToString(),
            baseTmpls ?? Array.Empty<SitecoreTemplate>(),
            fields ?? Array.Empty<SitecoreTemplateField>());

    public static SitecoreTemplateField GetField(
        string name = null,
        string type = null,
        bool? shared = null)
        => new SitecoreTemplateField(
            name ?? Guid.NewGuid().ToString(),
            type ?? Guid.NewGuid().ToString(),
            shared ?? RandomGenerator.GetDouble() > 0.5);
}
