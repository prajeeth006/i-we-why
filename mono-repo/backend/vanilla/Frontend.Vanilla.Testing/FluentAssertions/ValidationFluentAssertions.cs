using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using FluentAssertions.Primitives;
using Frontend.Vanilla.Core.Validation;

namespace Frontend.Vanilla.Testing.FluentAssertions;

/// <summary>
///     Fluent assertions validating an object and checking related errors.
/// </summary>
internal static class ValidationFluentAssertions
{
    public static void BeValidIf(this ObjectAssertions assertions, bool expectedIsValid, params ValidationResult[] expectedErrorsIfInvalid)
    {
        if (expectedIsValid)
            assertions.BeValid();
        else
            assertions.BeInvalid(expectedErrorsIfInvalid);
    }

    public static void BeValid(this ObjectAssertions assertions)
    {
        var errors = ObjectValidator.GetErrors(assertions.Subject);

        if (errors.Count != 0)
            throw FailureHelper.CreateError(DumpErrors("Expected object to be valid but it's invalid with these errors:", errors));
    }

    public static IReadOnlyList<ValidationResult> BeInvalid(this ObjectAssertions assertions, params ValidationResult[] expectedErrors)
    {
        var actualErrors = ObjectValidator.GetErrors(assertions.Subject);

        if (expectedErrors.Length == 0 && actualErrors.Count > 0)
            return actualErrors; // It's invalid and no exact errors are expected

        if (actualErrors.Count == 0)
            throw FailureHelper.CreateError(DumpErrors("Expected object to be invalid with following errors but it is valid:", expectedErrors));

        var missingExpectedErrors = expectedErrors.Except(actualErrors, new ValidationResultComparer()).ToList();
        var unexpectedActualErrors = actualErrors.Except(expectedErrors, new ValidationResultComparer()).ToList();

        if (missingExpectedErrors.Count > 0 || unexpectedActualErrors.Count > 0)
        {
            var sections = new List<string> { "Object is invalid as expected but errors differ." };
            if (missingExpectedErrors.Count > 0)
                sections.AddRange(DumpErrors("These are missing expected errors:", missingExpectedErrors));

            if (unexpectedActualErrors.Count > 0)
                sections.AddRange(DumpErrors("These are unexpected actual errors:", unexpectedActualErrors));

            throw FailureHelper.CreateError(sections);
        }

        return actualErrors;
    }

    public static IReadOnlyList<ValidationResult> BeInvalidWithError(this ObjectAssertions assertions, string fieldName, string error)
    {
        return assertions.BeInvalid(new ValidationResult(error, new[] { fieldName }));
    }

    private static IEnumerable<string> DumpErrors(string headerText, IEnumerable<ValidationResult> errors)
    {
        return new[] { headerText }.Concat(errors.Select(e => $"  Members: {string.Join(", ", e.MemberNames)}{Environment.NewLine}  Message: {e.ErrorMessage}"));
    }
}
