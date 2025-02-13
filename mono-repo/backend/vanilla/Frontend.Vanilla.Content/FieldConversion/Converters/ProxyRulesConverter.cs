using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Content.FieldConversion.Converters;

internal sealed class ProxyRulesConverter : IFieldConverter<IReadOnlyList<ProxyRule>>
{
    public IReadOnlyList<ProxyRule> Convert(IFieldConversionContext context)
    {
        if (string.IsNullOrWhiteSpace(context.FieldValue))
            return Array.Empty<ProxyRule>();

        var dtos = JsonConvert.DeserializeObject<List<ProxyRuleDto>>(context.FieldValue)
                   ?? throw new FormatException("Null deserialized from JSON in the field value.");

        return dtos
            .ConvertAll(dto => new ProxyRule(dto.Condition, !string.IsNullOrWhiteSpace(dto.Target) ? context.CreateDocumentId(dto.Target) : null))
            .AsReadOnly();
    }

    private class ProxyRuleDto
    {
        public string Condition { get; set; }
        public string Target { get; set; }
    }
}
