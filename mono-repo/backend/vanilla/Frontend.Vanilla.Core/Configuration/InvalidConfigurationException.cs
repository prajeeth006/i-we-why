using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Indicates that some configuration instance is invalid, providing particular errors.
/// Usuall thrown manually by <see cref="IConfigurationFactory{TConfiguration,TDto}" /> or <see cref="IConfigurationBuilder{TConfiguration}" />.
/// </summary>
internal sealed class InvalidConfigurationException : Exception
{
    public IReadOnlyList<ValidationResult> Errors { get; }

    public InvalidConfigurationException(params ValidationResult[] errors)
        : this((IEnumerable<ValidationResult>)errors) { }

    public InvalidConfigurationException(IEnumerable<ValidationResult> errors)
        : this(Guard.NotEmptyNorNullItems(errors.ToList().AsReadOnly(), nameof(errors))) { }

    private InvalidConfigurationException(IReadOnlyList<ValidationResult> errors)
        : base("Configuration instance is invalid: " + errors.ConvertAll(e => e.ErrorMessage).ToDebugString())
        => Errors = errors;
}
