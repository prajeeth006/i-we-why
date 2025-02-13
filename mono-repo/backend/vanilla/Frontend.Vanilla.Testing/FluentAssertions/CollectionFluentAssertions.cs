using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using FluentAssertions;
using FluentAssertions.Collections;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Testing.FluentAssertions;

/// <summary>
///     Additional fluent assertions for collections.
/// </summary>
internal static class CollectionFluentAssertions
{
    // Shortcut so that no explicit casting to <see cref="IEnumerable{T}" /> is required.
    public static AndConstraint<GenericCollectionAssertions<T>> BeEquivalentTo<T>(this GenericCollectionAssertions<T> assertions, params T[] expected)
        => assertions.BeEquivalentTo(expected);

    public static AndConstraint<GenericCollectionAssertions<T>> BeEquivalentTo<T>(this GenericCollectionAssertions<T> assertions, IEnumerable<T> expected)
        => assertions.BeEquivalentTo(expected);

    // Shorthand b/c syntax for specifying order looks ugly and is longer
    public static AndConstraint<GenericCollectionAssertions<T>> BeEquivalentOrderedTo<T>(this GenericCollectionAssertions<T> assertions, params T[] expected)
        => assertions.BeEquivalentTo(expected, o => o.WithStrictOrdering());

    public static AndConstraint<GenericCollectionAssertions<T>> BeEquivalentOrderedTo<T>(this GenericCollectionAssertions<T> assertions, IEnumerable<T> expected)
        => assertions.BeEquivalentOrderedTo(expected.ToArray());

    public static AndConstraint<GenericCollectionAssertions<T>> ContainAll<T>(this GenericCollectionAssertions<T> assertions, params T[] expected)
        => assertions.Contain(expected);

    public static void MatchItems<T>(this GenericCollectionAssertions<T> assertions, params Expression<Func<T, bool>>[] predicates)
    {
        assertions.Subject.Should().NotBeNull();
        var actualItems = assertions.Subject.ToList();

        if (actualItems.Count != predicates.Length)
            throw FailureHelper.CreateError(
                $"Expected {predicates.Length} items but found {actualItems.Count}",
                $"Expected item predicates: {Serialize(predicates.Select(p => p.ToString()))}",
                $"Actual items: {Serialize(actualItems)}");

        for (var i = 0; i < actualItems.Count; i++)
        {
            bool isPassed;

            try
            {
                isPassed = predicates[i].Compile().Invoke(actualItems[i]);
            }
            catch (Exception ex)
            {
                throw FailureHelper.CreateError(
                    $"Evaluation of predicate for {i}. item (zero indexed) has failed. Predicate: {predicates[i]}",
                    $"Actual item: {Serialize(actualItems[i])}",
                    $"Exception: {ex}");
            }

            if (!isPassed)
                throw FailureHelper.CreateError(
                    $"Expected {i}. item (zero indexed) in the collection to satisfy predicate: {predicates[i]}",
                    $"Actual item: {Serialize(actualItems[i])}");
        }
    }

    private static string Serialize(object obj)
        => JsonConvert.SerializeObject(obj, Formatting.Indented);
}
