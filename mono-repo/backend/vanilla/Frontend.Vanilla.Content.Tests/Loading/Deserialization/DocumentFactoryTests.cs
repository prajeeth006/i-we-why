using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Content.Model.Implementation;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Deserialization;

public sealed class DocumentFactoryTests
{
    [Fact]
    public void ShouldCreateDocument()
    {
        var data = new DocumentData(Mock.Of<IDocumentMetadata>(d => d.Id == (DocumentId)"doc-id"), new Dictionary<string, object>());

        // Act
        var doc = DocumentFactory.Create(typeof(FolderDocument), data);

        doc.Data.Should().BeSameAs(data);
    }

    [Fact]
    public void ShouldBeFasterThanReflection()
    {
        var data = new DocumentData(Mock.Of<IDocumentMetadata>(d => d.Id == (DocumentId)"doc-id"), new Dictionary<string, object>());
        var reflectionTime = Measure(() => CreateUsingReflection(typeof(FolderDocument), data));
        var optimizedTime = Measure(() => DocumentFactory.Create(typeof(FolderDocument), data));

        optimizedTime.Should().BeLessThan(reflectionTime);
    }

    private static long Measure(Action action)
    {
        action(); // Warm-up

        var watch = new Stopwatch();

        for (var i = 0; i < 100000; i++)
        {
            watch.Start();
            action();
            watch.Stop();
        }

        return watch.ElapsedTicks;
    }

    private static IDocument CreateUsingReflection(Type type, DocumentData data)
        => (IDocument)Activator.CreateInstance(
            type,
            BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.CreateInstance,
            null,
            new object[] { data },
            null);
}
