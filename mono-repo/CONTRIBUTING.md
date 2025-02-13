These are guidelines for contributions to Frontend's monorepo. `TODO: Refine`

## Coding

### General
- Follow [SOLID principles](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)).
    - Especially design classes with single responsibility. Code is easier to understand, test, use and it is open for changes.
- Don't leave commented-out code
    - It brings confusion and doubts
    - not refactored
- Do not make anything public unless it is really needed.
    - Once it is public, somebody can start using it and then we cannot change it rather we will have to support it.
    - Even configuration classes should stay internal if they are meant to be provided only through DynaCon. On the other hand `Core`, `Content` and  `ServiceClients` should be usable standalone.

### .NET

- In general follow [.NET guidelines](https://msdn.microsoft.com/en-us/library/ms229042(v=vs.110).aspx) from Microsoft.
- We use custom [StyleCop](https://github.com/StyleCop/StyleCop) [rules](https://vie.git.bwinparty.com/vanilla/monorepo/blob/main/backend/vanilla/Frontend.Vanilla.ruleset) to enforce consistent code style.
- Write at least some XML comment on each class describing its responsibility.
    - It makes it much easier to understand what and how the class does.
    - It improves design: "If it's hard to document, it means it's too hard to use."
    - There should be single responsibility to describe (see SOLID principles).
- Prefer usage of interfaces on public API.
    - Consumers can extend and decorate components, or create own implementations.
    - Mocking in unit tests is easier because you just mock what you need.
    - It is according to Open/closed principle
    - If you really need a class, think about its usage in unit tests (easy mocking).
- Prefer `IEnumerable<>` for collection parameters and method return values if result is lazily enumerated.
    - More flexible, supports wide range of actual implementations.
    - Consumers can provide collection according to their preferences and needs.
    - Consumers may only need some (even first) returned item.
    - Easy to use in unit tests.
- Prefer `IReadOnlyList<>` for collection properties in general and for method return values if result is fully enumerated.
    - Accessing a property must not cause re-enumeration each time.
    - Compared to `IEnumerable<>` it allows more convenient usage for consumers (indexed access, no unnecessary multiple enumerations).
    - Still it is read-only which allows caching without risk of modification by consumers.
    - If you have already executed costly operation (e.g. service call) and need to do some minor processing on top (e.g. conversion) it doesn't make sense to pretend that result is lazily evaluated.
- Describe and check pre/post-conditions at least for public API
	- In order to find bugs eagerly, leverage ReSharper inspection, validate user input and avoid invalid states.
	- Use `Guard` for checking input parameters.
	- Use [JetBrains Annotations](https://www.jetbrains.com/help/resharper/Code_Analysis__Code_Annotations.html) especially `[NotNull]` and `[CanBeNull]`.
- Prefer [composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) and make classes sealed by default.
    - Arises from previous point.
- Add descriptive message to `[Obsolete("What to do.")]`
    - So that consumers know how they are supposed to adapt their code.
    - Examples: "Use FooBar instead.", "This is meant was Vanilla internal use only and will be removed in next major release."

### Angular / TypeScript

- Avoid using `any` or complex objects as a type - use interfaces instead.
- Avoid using exclamation mark to disable TypeScript: `object!.property`.
- Use dot notation instead of property accessor: `object.proeprty` instead of `object['property']`.
- Use strict comparison: `===` instead of `==`.
- Use Angular `inject` function instead of constructor for dependency injection: `const service = inject(Service)` instead of `constructor(service: Service) {}`.
- Do not use `void` as a return type explicitly, always provide a return type otherwise.
- Prefer `async` pipe instead of subscriptions for components: `observable.value | async as value`.
- Use `enum` for shared string constants instead of hard-coding them. Many of those already exists: `VanillaElements`, `LocalStoreKey`, `WindowEvent`, ect...
- Avoid querying and modifying HTML elements from the components directly, unless absolutely necessary.

## Testing
- Use [Fluent Assertions](https://fluentassertions.com/) in NUnit tests
    - Syntax is readable and concise.
- Test method names should follow pattern: TestedOperation_ShouldExpectedBehavior_IfState()
    - More readable than names without any underscores or with underscores everywhere.
    - Important parts are easy to distinguish therefore optimal for navigation.
    - Some parts can be skipped if they are obvious e.g. tested class has only single member, single state is tested...
    - Example: ChuckNorris_ShouldBeAbleToCutWires_IfUsingWiFi()
- Do not use underscores for any member names (except tests mentioned above)
    - Just a convention we agreed on.
- Unit tests
    - Regular *NUnit* tests.
    - Test single responsibility of a method or class.
    - Executed in complete isolation. All dependencies are mocked.
    - Should cover all possible corner cases, extreme situations and discovered defects. Therefore ideal code coverage (of a component) should be 100%.
    - Executed on each build and must pass always.
- Acceptance tests
    - Regular *NUnit* tests.
    - Test entire application component or feature.
    - Test only Vanilla code, external dependencies are mocked.
    - Should check use cases according to acceptance criteria, not special cases covered by unit tests in order not to avoid unnecessary duplication.
    - Executed on each build and must pass always.
- Integration tests
    - *NUnit* tests marked with `[IntegrationCategory]`.
    - Test accessibility of external service and the data contract.
    - Should not cover test Vanilla code because it's covered by other tests and integration tests are much slower.
    - Executed on each build but don't need to pass always in order not to block us when an external service is down.
- UI tests
    - *NUnit* tests running *Protractor.NET*.
    - Test UI related logic which can't be covered with other tests.
    - Test only Vanilla code, external dependencies are mocked.
    - Done in TestWeb which is dedicated for this purpose.
    - Executed on each build and must pass always.
