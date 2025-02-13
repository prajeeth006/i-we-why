using Frontend.Vanilla.Content.FieldConversion;

namespace Frontend.Vanilla.Content.Tests.Templates.Mapping;

internal static class FieldMappingHelper
{
    public static FieldMapping AsMapping<T>(this IFieldConverter<T> converter)
        => new FieldMapping<T>(converter);
}
