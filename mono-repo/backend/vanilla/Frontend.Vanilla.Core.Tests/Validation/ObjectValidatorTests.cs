using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation;

public class ObjectValidatorTests
{
    public class TestObject : IValidatableObject
    {
        public IReadOnlyList<ValidationResult> Errors { get; }
        public TestObject(params ValidationResult[] errors) => Errors = errors ?? Array.Empty<ValidationResult>();
        public IEnumerable<ValidationResult> Validate(ValidationContext ctx) => Errors;
    }

    [Fact]
    public void GetErrors_ShouldReturnErrors_IfInvalid()
    {
        var instance = new TestObject(new ValidationResult("Error 1"), new ValidationResult("Error 2"));

        var errors = ObjectValidator.GetErrors(instance); // Act

        errors.Should().Equal(instance.Errors)
            .And.NotBeSameAs(instance.Errors);
    }

    [Fact]
    public void GetErrors_ShouldReturnEmpty_IfValid()
        => ObjectValidator.GetErrors(new TestObject()).Should().BeEmpty();

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void IsValid_ShouldComputeValidity(bool hasError)
    {
        var instance = new TestObject(hasError ? new ValidationResult("Error") : null);

        var isValid = ObjectValidator.IsValid(instance); // Act

        isValid.Should().Be(!hasError);
    }

    [Fact]
    public void ValidateProperty_ShouldPrefixErrors()
    {
        var instance = new TestObject(
            new ValidationResult(null),
            new ValidationResult("Generic error."),
            new ValidationResult("Property1 is aweful.", new[] { "Property1" }),
            new ValidationResult("Properties are aweful.", new[] { "Property1", "Property2" }));

        var errors = ObjectValidator.ValidateProperty(instance, "Foo"); // Act

        var expect = new List<ValidationResult>
        {
            new ValidationResult("Foo is invalid.", new[] { "Foo" }),
            new ValidationResult("Foo - Generic error.", new[] { "Foo" }),
            new ValidationResult("Foo.Property1 is aweful.", new[] { "Foo.Property1" }),
            new ValidationResult("Foo - Properties are aweful.", new[] { "Foo.Property1", "Foo.Property2" }),
        };

        errors.Should().BeEquivalentTo(new List<ValidationResult>
        {
            new ValidationResult("Foo is invalid.", new[] { "Foo" }),
            new ValidationResult("Foo - Generic error.", new[] { "Foo" }),
            new ValidationResult("Foo.Property1 is aweful.", new[] { "Foo.Property1" }),
            new ValidationResult("Foo - Properties are aweful.", new[] { "Foo.Property1", "Foo.Property2" }),
        });
    }

    [Fact]
    public void ValidateItems_ShouldCollectAndPrefixErrorFromAllItems()
    {
        var items = new[]
        {
            new TestObject(new ValidationResult("Item is shitty.")),
            new TestObject(),
            new TestObject(new ValidationResult("Property1 is shitty.", new[] { "Property1" })),
        };

        var errors = ObjectValidator.ValidateItems(items, "Items"); // Act

        errors.Should().BeEquivalentTo(new List<ValidationResult>
        {
            new ValidationResult("Items[0] - Item is shitty.", new[] { "Items[0]" }),
            new ValidationResult("Items[2].Property1 is shitty.", new[] { "Items[2].Property1" }),
        });
    }

    [Fact]
    public void ValidateDictionaryValues_ShouldCollectAndPrefixErrorFromAllValues()
    {
        var dictionary = new Dictionary<string, TestObject>
        {
            { "first", new TestObject(new ValidationResult("Item is shitty.")) },
            { "second", new TestObject() },
            { "third", new TestObject(new ValidationResult("Property1 is shitty.", new[] { "Property1" })) },
        };

        var errors = ObjectValidator.ValidateDictionaryValues(dictionary, "Mapping"); // Act

        errors.Should().BeEquivalentTo(new List<ValidationResult>
        {
            new ValidationResult("Mapping[first] - Item is shitty.", new[] { "Mapping[first]" }),
            new ValidationResult("Mapping[third].Property1 is shitty.", new[] { "Mapping[third].Property1" }),
        });
    }
}
