using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation;

/// <summary>
/// Helper class to make validation provided by <see cref="Validator" /> more seamless.
/// </summary>
internal static class ObjectValidator
{
    public static List<ValidationResult> GetErrors(object instance)
    {
        var errors = new List<ValidationResult>();
        Validator.TryValidateObject(instance, new ValidationContext(instance), errors, validateAllProperties: true);

        return errors;
    }

    public static bool IsValid(object instance)
        // By not providing the collection of validationResults, validation will break on first error -> enough to determine validity
        => Validator.TryValidateObject(instance, new ValidationContext(instance), validationResults: null, validateAllProperties: true);

    public static IEnumerable<ValidationResult> ValidateProperty(object propertyValue, TrimmedRequiredString propertyName)
        => GetErrors(propertyValue).Select(error =>
        {
            // "Bar is required.", ["Bar"] with property "Foo" => "Foo.Bar is required.", ["Foo.Bar"]
            // "It's invalid.", [] with property "Foo" => "Foo - It's invalid.", ["Foo"]
            var members = error.MemberNames.Where(m => !string.IsNullOrWhiteSpace(m)).ToList();
            var msgSeparator = members.Count == 1 && error.ErrorMessage?.StartsWith(members[0]) == true ? "." : " - ";
            var newMsg = !string.IsNullOrWhiteSpace(error.ErrorMessage) ? propertyName + msgSeparator + error.ErrorMessage : propertyName + " is invalid.";
            var newMembers = members.Count > 0 ? members.ConvertAll(m => $"{propertyName}.{m}") : new List<string> { propertyName };

            return new ValidationResult(newMsg, newMembers);
        });

    public static IEnumerable<ValidationResult> ValidateItems<TItem>(IEnumerable<TItem>? propertyValue, TrimmedRequiredString propertyName)
        => propertyValue.NullToEmpty()
            .Select((x, i) => (Item: x, Index: i))
            .Where(x => !RequiredHelper.IsValidatedByRequiredAttribute(x.Item))
            .SelectMany(x => ValidateProperty(x.Item!, $"{propertyName}[{x.Index}]"));

    public static IEnumerable<ValidationResult> ValidateDictionaryValues<TKey, TValue>(IEnumerable<KeyValuePair<TKey, TValue>>? propertyValue,
        TrimmedRequiredString propertyName)
        where TKey : notnull
        => propertyValue.NullToEmpty()
            .Where(x => !RequiredHelper.IsValidatedByRequiredAttribute(x.Value))
            .SelectMany(x => ValidateProperty(x.Value!, $"{propertyName}[{x.Key}]"));
}
